import Link from "next/link";
import { ArrowRight, ShieldCheck, Bot, Lock, Workflow, FileSearch, AlertTriangle, FileText, Table2, Image as ImageIcon, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";

const pillars = [
  {
    icon: Lock,
    title: "Air-Gapped Operation",
    desc: "No external connections permitted. Zero data leaves the sovereign perimeter during any stage of processing.",
    accent: "success",
  },
  {
    icon: Workflow,
    title: "Agentic Pipeline",
    desc: "Multi-step OCR → extraction → RAG → reasoning → approval workflow, fully traced and auditable node by node.",
    accent: "accent",
  },
  {
    icon: ShieldCheck,
    title: "Human-in-the-Loop",
    desc: "Mandatory approval checkpoint before final report generation. Edit, approve, or reject every AI recommendation.",
    accent: "warning",
  },
];

const features = [
  {
    icon: FileSearch,
    title: "Industrial Document Analysis",
    desc: "Inspection reports, compliance audits, maintenance logs with structured findings extraction.",
  },
  {
    icon: Bot,
    title: "Sovereign LLM Reasoning",
    desc: "On-premises large language model executing risk assessment, anomaly detection, and recommendation synthesis.",
  },
  {
    icon: AlertTriangle,
    title: "Compliance-Grade Audit Trail",
    desc: "Every agent step, model input, and operator decision is immutable logged for regulatory review.",
  },
  {
    icon: FileText,
    title: "DOCX Report Generation",
    desc: "Generate formatted Word documents with findings, risk matrices, and recommended action plans.",
  },
  {
    icon: Table2,
    title: "XLSX Data Export",
    desc: "Structured findings, risk tables, and equipment datasets exported as spreadsheets for dashboards.",
  },
  {
    icon: ImageIcon,
    title: "Visual Document Input",
    desc: "PDF documents, PNG scans, and JPG photographs supported through on-device OCR pipeline.",
  },
];

export default function Home() {
  return (
    <div className="flex-1 flex flex-col">
      <section className="flex-1 flex items-center">
        <div className="max-w-[1400px] mx-auto w-full px-4 md:px-8 py-14 md:py-20">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-7 flex flex-col gap-7">
              <div className="flex items-center gap-2">
                <Badge variant="success" className="text-[10px]">
                  <ShieldCheck size={10} />
                  SECURE MODE ACTIVE
                </Badge>
                <Badge variant="outline" className="text-[10px]">
                  <span className="text-accent">◆</span> MRPL Refinery Campus — On-Premises
                </Badge>
              </div>

              <div className="flex flex-col gap-4">
                <h1 className="text-4xl md:text-5xl lg:text-[56px] font-semibold leading-[1.05] tracking-tight text-foreground">
                  Sovereign Agentic AI
                  <span className="block">
                    for{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-success">
                      Confidential Industrial
                    </span>{" "}
                    Intelligence
                  </span>
                </h1>
                <p className="text-base md:text-lg text-muted leading-relaxed max-w-2xl">
                  An air-gapped, operator-approved AI workbench for analyzing
                  inspection reports, compliance audits, and maintenance logs —
                  with full agent traceability, mandatory human-in-the-loop
                  checkpoints, and direct DOCX / XLSX report generation.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link href="/chat">
                  <Button
                    size="lg"
                    variant="primary"
                    rightIcon={<ArrowRight size={17} />}
                  >
                    Launch Workbench
                  </Button>
                </Link>
                <Button variant="secondary" size="lg">
                  View Architecture
                </Button>
              </div>

              <div className="flex items-center gap-5 text-[11px] text-muted pt-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-slow" />
                  0 external connections
                </div>
                <div className="flex items-center gap-1.5">
                  <Lock size={11} />
                  TEE Enclaved
                </div>
                <div className="flex items-center gap-1.5">
                  <Workflow size={11} />
                  7-Node Pipeline
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <Card className="overflow-hidden border-border/70 shadow-2xl shadow-black/30">
                <div className="h-10 border-b border-border bg-panel-2/50 flex items-center gap-2 px-4">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-danger/80" />
                    <div className="w-3 h-3 rounded-full bg-warning/80" />
                    <div className="w-3 h-3 rounded-full bg-success/80" />
                  </div>
                  <div className="mx-auto text-[10px] text-muted font-mono">
                    workbench.mrpl.local / agent-trace
                  </div>
                </div>
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="accent" className="text-[9px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                        PIPELINE RUNNING
                      </Badge>
                      <Badge variant="outline" className="text-[9px] font-mono">
                        task-83a2f7d1
                      </Badge>
                    </div>
                    <span className="text-[10px] text-muted tabular-nums">
                      14:02:47
                    </span>
                  </div>

                  <div className="space-y-3">
                    {[
                      { label: "Task created", status: "done", time: "0s" },
                      { label: "File uploaded", status: "done", time: "1.2s" },
                      { label: "OCR extraction", status: "done", time: "3.8s" },
                      { label: "Findings extraction", status: "done", time: "5.1s" },
                      { label: "RAG search", status: "running", time: "…" },
                      { label: "Recommendation", status: "pending", time: "—" },
                      { label: "Human approval", status: "pending", time: "—" },
                    ].map((step, i) => (
                      <div key={i} className="flex items-center gap-3 pl-1">
                        <div
                          className={
                            "w-5 h-5 rounded-full flex items-center justify-center shrink-0 border " +
                            (step.status === "done"
                              ? "bg-success/15 text-success border-success/30"
                              : step.status === "running"
                              ? "bg-accent/15 text-accent border-accent/30"
                              : "border-dashed border-muted-2 text-muted-2")
                          }
                        >
                          {step.status === "done" && (
                            <svg
                              viewBox="0 0 20 20"
                              fill="none"
                              className="w-3 h-3"
                            >
                              <path
                                d="M5 10.5l3 3 7-7"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                          {step.status === "running" && (
                            <div className="w-2.5 h-2.5 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                          )}
                        </div>
                        <span
                          className={
                            "text-sm flex-1 " +
                            (step.status === "pending"
                              ? "text-muted"
                              : "text-foreground")
                          }
                        >
                          {step.label}
                        </span>
                        <span className="text-[10px] text-muted tabular-nums w-10 text-right">
                          {step.time}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-lg border border-warning/30 bg-warning/5 p-3 mt-5">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle size={12} className="text-warning" />
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-warning">
                        Pending Human Review
                      </span>
                    </div>
                    <p className="text-xs text-foreground leading-relaxed">
                      Next step requires operator approval before final report
                      is generated. Confidence score: <span className="font-semibold">94%</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border/60 bg-panel/30">
        <div className="max-w-[1400px] mx-auto w-full px-4 md:px-8 py-12 md:py-16">
          <div className="grid md:grid-cols-3 gap-5">
            {pillars.map((pillar) => (
              <Card
                key={pillar.title}
                className="bg-background/40 hover:bg-panel-2/40 transition-colors"
              >
                <CardContent className="p-6 flex flex-col gap-4">
                  <div
                    className={
                      "w-11 h-11 rounded-xl flex items-center justify-center border " +
                      (pillar.accent === "success"
                        ? "bg-success/10 text-success border-success/30"
                        : pillar.accent === "warning"
                        ? "bg-warning/10 text-warning border-warning/30"
                        : "bg-accent/10 text-accent border-accent/30")
                    }
                  >
                    <pillar.icon size={20} strokeWidth={2} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-sm font-semibold tracking-tight text-foreground">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-muted leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                  <div className="mt-auto pt-2">
                    <Link
                      href="/chat"
                      className="text-[11px] font-medium text-accent inline-flex items-center gap-1 hover:gap-1.5 transition-all"
                    >
                      Launch workbench <ChevronRight size={12} />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="max-w-[1400px] mx-auto w-full px-4 md:px-8 py-12 md:py-16">
          <div className="max-w-2xl mb-10">
            <Badge variant="outline" className="text-[10px] mb-3">
              CAPABILITIES
            </Badge>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-3">
              Built for regulated industrial environments
            </h2>
            <p className="text-sm text-muted leading-relaxed">
              Every component of the workbench is engineered to operate within
              air-gapped perimeters, giving operators full control over
              confidential inspection data, compliance records, and AI-generated
              recommendations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feat) => (
              <div
                key={feat.title}
                className="group rounded-xl border border-border bg-panel/50 p-5 hover:bg-panel-2/60 hover:border-muted-2/70 transition-all"
              >
                <div className="w-9 h-9 rounded-lg bg-background border border-border flex items-center justify-center text-muted group-hover:text-accent group-hover:border-accent/30 transition-colors mb-3.5">
                  <feat.icon size={17} strokeWidth={1.8} />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1.5">
                  {feat.title}
                </h3>
                <p className="text-xs text-muted leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-border bg-gradient-to-br from-accent/5 via-transparent to-success/5 p-7 md:p-9 flex flex-col md:flex-row md:items-center gap-5 md:gap-8">
            <div className="flex-1">
              <Badge variant="accent" className="text-[10px] mb-2.5">
                READY
              </Badge>
              <h3 className="text-lg md:text-xl font-semibold text-foreground tracking-tight mb-1.5">
                Begin analyzing your first document
              </h3>
              <p className="text-sm text-muted leading-relaxed max-w-lg">
                Launch the sovereign workbench. Upload a PDF inspection report,
                PNG scan, or XLSX dataset and ask your first question — all
                processing executes on-premises without any external call.
              </p>
            </div>
            <div className="md:shrink-0">
              <Link href="/chat">
                <Button size="lg" rightIcon={<ArrowRight size={17} />}>
                  Launch Workbench
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
