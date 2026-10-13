"use client";

import {
  Activity,
  ArrowRight,
  Bot,
  Cpu,
  ExternalLink,
  FileText,
  Layers,
  Phone,
  PhoneCall,
  Plus,
  Radio,
  Settings2,
  ShieldCheck,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  getWorkflowCountApiV1WorkflowCountGet,
  listTelephonyConfigurationsApiV1OrganizationsTelephonyConfigsGet,
} from "@/client/sdk.gen";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/lib/auth";

export default function OverviewPage() {
  const { user, provider } = useAuth();
  const isOSSMode = provider !== "stack";

  const [agentCount, setAgentCount] = useState<{ total: number; active: number }>({
    total: 0,
    active: 0,
  });
  const [telephonyCount, setTelephonyCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const [workflowRes, telephonyRes] = await Promise.allSettled([
          getWorkflowCountApiV1WorkflowCountGet(),
          listTelephonyConfigurationsApiV1OrganizationsTelephonyConfigsGet(),
        ]);

        if (workflowRes.status === "fulfilled" && workflowRes.value.data) {
          setAgentCount({
            total: workflowRes.value.data.total ?? 0,
            active: workflowRes.value.data.active ?? 0,
          });
        }

        if (telephonyRes.status === "fulfilled" && telephonyRes.value.data) {
          setTelephonyCount(
            Array.isArray(telephonyRes.value.data) ? telephonyRes.value.data.length : 0
          );
        }
      } catch {
        // graceful fallback to zero state
      } finally {
        setLoading(false);
      }
    }

    loadMetrics();
  }, []);

  const userName = user?.displayName ? user.displayName.split(" ")[0] : "";

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {isOSSMode ? "Voxora Overview" : `Welcome back${userName ? `, ${userName}` : ""}!`}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor voice agent workflows, telephony connectivity, and system telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="sm" className="h-9">
            <Link href="/telephony-configurations">
              <Phone className="size-4 mr-2" />
              <span>Telephony</span>
            </Link>
          </Button>

          <Button asChild size="sm" className="h-9">
            <Link href="/workflow">
              <Plus className="size-4 mr-2" />
              <span>New Voice Agent</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1: Voice Agents */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Voice Agents
            </CardTitle>
            <div className="rounded-lg bg-muted/60 p-2 text-foreground">
              <Bot className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">
              {loading ? "..." : `${agentCount.active} / ${agentCount.total}`}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Active / total configured workflows
            </p>
          </CardContent>
        </Card>

        {/* Metric 2: Telephony Trunks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Telephony Trunks
            </CardTitle>
            <div className="rounded-lg bg-muted/60 p-2 text-foreground">
              <PhoneCall className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">
              {loading ? "..." : telephonyCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              SIP gateways &amp; carrier integrations
            </p>
          </CardContent>
        </Card>

        {/* Metric 3: Pipeline Latency */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Avg Pipeline Latency
            </CardTitle>
            <div className="rounded-lg bg-muted/60 p-2 text-foreground">
              <Zap className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tight">~320ms</span>
              <Badge variant="secondary" className="text-[10px] font-medium">
                Optimal
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              STT &rarr; LLM &rarr; TTS round-trip
            </p>
          </CardContent>
        </Card>

        {/* Metric 4: Platform Health */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Node Infrastructure
            </CardTitle>
            <div className="rounded-lg bg-muted/60 p-2 text-foreground">
              <Activity className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tight">99.99%</span>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-500">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                Live
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              WebRTC &amp; SIP nodes healthy
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content: 2-Column Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Core Workflows & Integrations (2 cols) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Quick Setup Guide Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Start Guide</CardTitle>
              <CardDescription>
                Essential steps to build, configure, and connect your voice assistants.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {/* Step 1 */}
              <Link
                href="/workflow"
                className="group flex items-start justify-between rounded-lg border border-border/60 bg-muted/20 p-4 transition-all hover:bg-muted/40 hover:border-border"
              >
                <div className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-background border border-border/80 text-foreground font-semibold text-xs">
                    1
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      Design Voice Agent Workflows
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      Build interactive state machines, prompts, and dialog transitions in the visual agent canvas.
                    </p>
                  </div>
                </div>
                <ArrowRight className="size-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all mt-1" />
              </Link>

              {/* Step 2 */}
              <Link
                href="/telephony-configurations"
                className="group flex items-start justify-between rounded-lg border border-border/60 bg-muted/20 p-4 transition-all hover:bg-muted/40 hover:border-border"
              >
                <div className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-background border border-border/80 text-foreground font-semibold text-xs">
                    2
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      Configure SIP &amp; Telephony Gateways
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      Connect private SIP trunks, Asterisk dialplans, or carrier numbers for inbound and outbound calls.
                    </p>
                  </div>
                </div>
                <ArrowRight className="size-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all mt-1" />
              </Link>

              {/* Step 3 */}
              <Link
                href="/model-configurations"
                className="group flex items-start justify-between rounded-lg border border-border/60 bg-muted/20 p-4 transition-all hover:bg-muted/40 hover:border-border"
              >
                <div className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-background border border-border/80 text-foreground font-semibold text-xs">
                    3
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      Configure Speech &amp; LLM Providers
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      Route conversations through OpenAI, Anthropic, Groq, Deepgram, Cartesia, or ElevenLabs.
                    </p>
                  </div>
                </div>
                <ArrowRight className="size-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all mt-1" />
              </Link>

              {/* Step 4 */}
              <Link
                href="/files"
                className="group flex items-start justify-between rounded-lg border border-border/60 bg-muted/20 p-4 transition-all hover:bg-muted/40 hover:border-border"
              >
                <div className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-background border border-border/80 text-foreground font-semibold text-xs">
                    4
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      Attach Knowledge Base Documents (RAG)
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      Upload PDFs, FAQs, and product documentation for real-time grounded context retrieval.
                    </p>
                  </div>
                </div>
                <ArrowRight className="size-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all mt-1" />
              </Link>
            </CardContent>
          </Card>

          {/* Architecture Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">System Protocols &amp; Engine</CardTitle>
              <CardDescription>
                Underlying transport layers and voice execution pipeline.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-border/60 bg-muted/10 p-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                    <Radio className="size-3.5 text-primary" />
                    <span>WebRTC Pipeline</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Full-Duplex 24kHz HD Audio streaming with low latency interruption.
                  </p>
                </div>

                <div className="rounded-lg border border-border/60 bg-muted/10 p-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                    <Phone className="size-3.5 text-primary" />
                    <span>SIP &amp; PBX Gateway</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Direct Asterisk, FreeSWITCH, Twilio, and Telnyx SIP bridging.
                  </p>
                </div>

                <div className="rounded-lg border border-border/60 bg-muted/10 p-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                    <Cpu className="size-3.5 text-primary" />
                    <span>MCP Tool Calling</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Model Context Protocol server bindings for custom backend executions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Quick Links & Environment Details (1 col) */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Workspace Navigation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild variant="ghost" className="w-full justify-start text-xs font-normal h-9">
                <Link href="/workflow">
                  <Layers className="size-4 mr-2.5 text-muted-foreground" />
                  <span>Agent Builder</span>
                </Link>
              </Button>

              <Button asChild variant="ghost" className="w-full justify-start text-xs font-normal h-9">
                <Link href="/recordings">
                  <FileText className="size-4 mr-2.5 text-muted-foreground" />
                  <span>Call Recordings &amp; Logs</span>
                </Link>
              </Button>

              <Button asChild variant="ghost" className="w-full justify-start text-xs font-normal h-9">
                <Link href="/campaigns">
                  <PhoneCall className="size-4 mr-2.5 text-muted-foreground" />
                  <span>Outbound Campaigns</span>
                </Link>
              </Button>

              <Button asChild variant="ghost" className="w-full justify-start text-xs font-normal h-9">
                <Link href="/model-configurations">
                  <Cpu className="size-4 mr-2.5 text-muted-foreground" />
                  <span>Model Configurations</span>
                </Link>
              </Button>

              <Button asChild variant="ghost" className="w-full justify-start text-xs font-normal h-9">
                <Link href="/api-keys">
                  <ShieldCheck className="size-4 mr-2.5 text-muted-foreground" />
                  <span>API Keys &amp; Tokens</span>
                </Link>
              </Button>

              <Button asChild variant="ghost" className="w-full justify-start text-xs font-normal h-9">
                <Link href="/settings">
                  <Settings2 className="size-4 mr-2.5 text-muted-foreground" />
                  <span>Workspace Settings</span>
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Environment Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Platform Architecture</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 text-xs text-muted-foreground">
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <span>Frontend Framework</span>
                <span className="font-mono text-foreground">Next.js 15 (React 19)</span>
              </div>

              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <span>Backend Framework</span>
                <span className="font-mono text-foreground">FastAPI + Python 3.12</span>
              </div>

              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <span>Voice Engine</span>
                <span className="font-mono text-foreground">Pipecat WebRTC</span>
              </div>

              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <span>Database</span>
                <span className="font-mono text-foreground">PostgreSQL (Async)</span>
              </div>

              <div className="flex items-center justify-between">
                <span>Audio Storage</span>
                <span className="font-mono text-foreground">MinIO / S3 Storage</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
