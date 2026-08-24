import re
import json
import logging
from typing import Optional, List, Dict, Any
import httpx
from app.core.config import settings

logger = logging.getLogger("workbench.llm")

PREFERRED_MODELS = [
    "qwen3:4b",
    "phi4-mini:latest",
    "phi4-mini",
    "qwen2.5:7b",
    "qwen2.5",
    "llama3.2:3b",
    "llama3.2",
    "deepseek-r1:1.5b",
    "mistral"
]

async def get_available_models() -> List[str]:
    """Query local Ollama to list available downloaded models."""
    try:
        async with httpx.AsyncClient(timeout=4.0) as client:
            resp = await client.get(f"{settings.OLLAMA_HOST}/api/tags")
            if resp.status_code == 200:
                models = resp.json().get("models", [])
                return [m.get("name") for m in models if m.get("name")]
    except Exception as e:
        logger.warning(f"Could not connect to Ollama at {settings.OLLAMA_HOST}: {e}")
    return []

async def pick_best_model(preferred: Optional[str] = None) -> str:
    """Select the best available local model on the device."""
    available = await get_available_models()
    if not available:
        return preferred or "qwen3:4b"
    
    if preferred:
        for av in available:
            if preferred.lower() in av.lower() or av.lower() in preferred.lower():
                return av

    for model in PREFERRED_MODELS:
        for av in available:
            if model.lower() in av.lower():
                return av

    return available[0]

async def query_ollama(
    prompt: str,
    system: Optional[str] = None,
    model: Optional[str] = None,
    temperature: float = 0.2,
    num_predict: Optional[int] = 1536,
    timeout: float = 120.0
) -> str:
    """Send an inference request to local Ollama with generous token budget and robust output cleaning."""
    available = await get_available_models()
    selected_model = await pick_best_model(model)
    
    # Candidate models to try in order
    candidate_models = [selected_model]
    for m in available:
        if m not in candidate_models:
            candidate_models.append(m)

    last_error = None
    for candidate in candidate_models:
        options: Dict[str, Any] = {
            "temperature": temperature
        }
        if num_predict:
            options["num_predict"] = num_predict

        payload: Dict[str, Any] = {
            "model": candidate,
            "prompt": prompt,
            "stream": False,
            "options": options
        }
        if system:
            payload["system"] = system

        try:
            async with httpx.AsyncClient(timeout=timeout) as client:
                logger.info(f"Sending prompt to local Ollama model: {candidate}")
                resp = await client.post(f"{settings.OLLAMA_HOST}/api/generate", json=payload)
                if resp.status_code == 200:
                    data = resp.json()
                    result = data.get("response", "").strip()
                    
                    # If response is empty but thinking exists, or if think tags are embedded
                    if not result and data.get("thinking"):
                        result = data.get("thinking", "").strip()

                    if "<think>" in result:
                        clean_res = re.sub(r"<think>.*?</think>", "", result, flags=re.DOTALL).strip()
                        if clean_res:
                            return clean_res
                        # If think tag was unclosed because of cutoff, remove leading <think>
                        clean_res = re.sub(r"^<think>.*", "", result, flags=re.DOTALL).strip()
                        if clean_res:
                            return clean_res
                    if result:
                        return result
                else:
                    last_error = f"Ollama HTTP {resp.status_code}: {resp.text}"
                    logger.warning(f"Model {candidate} failed with status {resp.status_code}: {resp.text}")
        except Exception as e:
            last_error = str(e)
            logger.warning(f"Exception querying Ollama model {candidate}: {e}")

    # If all candidate models failed
    if not available:
        return f"Unable to reach local sovereign Ollama service at {settings.OLLAMA_HOST}. Please ensure Ollama is running (`ollama serve`)."
    return f"Inference error with available local models ({', '.join(available)}): {last_error}"

def extract_json_from_text(text: str) -> Optional[Dict[str, Any]]:
    """Extract JSON dictionary from text containing markdown fences or raw JSON."""
    if not text:
        return None
    
    # 1. Clean thinking tags if present
    cleaned = re.sub(r"<think>.*?</think>", "", text, flags=re.DOTALL).strip()
    
    # 2. Try direct json parse
    try:
        return json.loads(cleaned)
    except Exception:
        pass

    # 3. Try finding ```json ... ``` code fence
    fence_match = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", cleaned, re.DOTALL)
    if fence_match:
        try:
            return json.loads(fence_match.group(1))
        except Exception:
            pass

    # 4. Try finding outermost { ... }
    brace_match = re.search(r"(\{.*\})", cleaned, re.DOTALL)
    if brace_match:
        try:
            return json.loads(brace_match.group(1))
        except Exception:
            pass

    return None

async def query_ollama_json(
    prompt: str,
    system: Optional[str] = None,
    model: Optional[str] = None,
    temperature: float = 0.1,
    num_predict: Optional[int] = None,
    timeout: float = 90.0,
    fallback_dict: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """Query local Ollama and return structured JSON dictionary."""
    raw_response = await query_ollama(
        prompt=prompt,
        system=system,
        model=model,
        temperature=temperature,
        num_predict=num_predict,
        timeout=timeout
    )
    parsed = extract_json_from_text(raw_response)
    if parsed and isinstance(parsed, dict):
        return parsed
    
    if fallback_dict is not None:
        # If couldn't parse json, attach raw text to fallback
        res = dict(fallback_dict)
        res["raw_llm_response"] = raw_response
        return res
        
    return {"raw_llm_response": raw_response}
