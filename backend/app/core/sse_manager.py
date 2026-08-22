import asyncio
import json
import logging
from typing import Dict, List, Any

logger = logging.getLogger("workbench.sse")

class SSEManager:
    """
    Manages in-memory pub-sub queues for Server-Sent Events (SSE) streaming
    keyed by task_id. Enables multiple clients to listen to a single task execution.
    """
    def __init__(self):
        self._subscribers: Dict[str, List[asyncio.Queue]] = {}
        self._lock = asyncio.Lock()

    async def subscribe(self, task_id: str) -> asyncio.Queue:
        """Create a new event queue for a given task_id subscriber."""
        queue: asyncio.Queue = asyncio.Queue()
        async with self._lock:
            if task_id not in self._subscribers:
                self._subscribers[task_id] = []
            self._subscribers[task_id].append(queue)
            logger.info("New SSE client subscribed to task %s (total: %d)", task_id, len(self._subscribers[task_id]))
        return queue

    async def unsubscribe(self, task_id: str, queue: asyncio.Queue):
        """Remove a subscriber queue when client disconnects."""
        async with self._lock:
            if task_id in self._subscribers:
                if queue in self._subscribers[task_id]:
                    self._subscribers[task_id].remove(queue)
                if not self._subscribers[task_id]:
                    del self._subscribers[task_id]
                logger.info("SSE client unsubscribed from task %s", task_id)

    async def publish(self, task_id: str, event_type: str, data: Dict[str, Any]):
        """
        Broadcast an SSE event payload to all active subscriber queues for task_id.
        Payload is formatted as SSE string: 'event: <type>\ndata: <json>\n\n'
        """
        formatted_message = f"event: {event_type}\ndata: {json.dumps(data)}\n\n"
        async with self._lock:
            queues = self._subscribers.get(task_id, [])
            for q in queues:
                await q.put(formatted_message)

    def is_active(self, task_id: str) -> bool:
        """Check if there are any active listeners for a task."""
        return task_id in self._subscribers and len(self._subscribers[task_id]) > 0

sse_manager = SSEManager()
