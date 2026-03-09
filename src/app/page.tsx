"use client";

import * as React from "react";
import { initiateComprehensiveRiskAnalysis, InitiateComprehensiveRiskAnalysisOutput, InitiateComprehensiveRiskAnalysisInput } from "@/ai/flows/initiate-comprehensive-risk-analysis";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskGauge } from "@/components/dashboard/risk-gauge";
import { 
  AlertTriangle, 
  ShieldCheck, 
  Activity, 
  ArrowRight,
  Loader2,
  ListRestart,
  ShieldAlert,
  FileText,
  Cpu,
  Zap,
  TrendingUp,
  Scale,
  Globe,
  UploadCloud,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  type ChartConfig
} from "@/components/ui/chart";
import { 
  Bar, 
  BarChart, 
  XAxis, 
  YAxis, 
  Cell
} from "recharts";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const chartConfig = {
  score: {
    label: "Risk Score",
  },
  financial: {
    label: "Financial",
    color: "hsl(var(--chart-1))",
  },
  cybersecurity: {
    label: "Cyber",
    color: "hsl(var(--chart-2))",
  },
  operational: {
    label: "Operational",
    color: "hsl(var(--chart-3))",
  },
  compliance: {
    label: "Compliance",
    color: "hsl(var(--chart-4))",
  },
  strategicMarket: {
    label: "Strategic",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export default function Dashboard() {
  const [loading, setLoading] = React.useState(false);
  const [analyzing, setAnalyzing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [data, setData] = React.useState<InitiateComprehensiveRiskAnalysisOutput | null>(null);
  const [showSetup, setShowSetup] = React.useState(true);

  const [formData, setFormData] = React.useState<InitiateComprehensiveRiskAnalysisInput>({
    companyName: "Acme Corp",
    srsDocument: "",
    brdDocument: "",
    legalPolicyDocument: "",
    proposalDocument: "",
  });

  const handleStartAnalysis = async () => {
    setAnalyzing(true);
    setError(null);
    try {
      const result = await initiateComprehensiveRiskAnalysis(formData);
      setData(result);
      setShowSetup(false);
    } catch (e: any) {
      setError(e.message || "Analysis Interrupted");
    } finally {
      setAnalyzing(false);
    }
  };

  const domainData = data ? [
    { id: 'financial', name: "Financial", score: data.domainAnalysis.financial.overallRiskScore, fill: "hsl(var(--chart-1))", icon: TrendingUp },
    { id: 'cybersecurity', name: "Cyber", score: data.domainAnalysis.cybersecurity.overallRiskScore, fill: "hsl(var(--chart-2))", icon: ShieldCheck },
    { id: 'operational', name: "Operational", score: data.domainAnalysis.operational.overallRiskScore, fill: "hsl(var(--chart-3))", icon: Zap },
    { id: 'compliance', name: "Compliance", score: data.domainAnalysis.compliance.overallRiskScore, fill: "hsl(var(--chart-4))", icon: Scale },
    { id: 'strategicMarket', name: "Strategic", score: data.domainAnalysis.strategicMarket.overallRiskScore, fill: "hsl(var(--chart-5))", icon: Globe },
  ] : [];

  if (showSetup) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-white font-headline">Intelligence Setup</h1>
          <p className="text-muted-foreground">Provide the core documents for multi-agent risk orchestration.</p>
        </div>

        <Card className="bg-card/50 border-primary/20 shadow-2xl overflow-hidden">
          <div className="h-2 w-full bg-gradient-to-r from-primary/10 via-primary to-primary/10" />
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-primary" />
              Strategic Document Entry
            </CardTitle>
            <CardDescription>Enter the raw text content for cross-correlation analysis.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-xs uppercase font-bold text-muted-foreground">Organization Name</Label>
              <Input 
                value={formData.companyName} 
                onChange={e => setFormData({...formData, companyName: e.target.value})}
                placeholder="e.g., Global Horizon Logistics"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs uppercase font-bold text-muted-foreground">SRS Document Content</Label>
                <Textarea 
                  value={formData.srsDocument}
                  onChange={e => setFormData({...formData, srsDocument: e.target.value})}
                  placeholder="System requirements, uptime targets, technical constraints..."
                  className="bg-white/5 border-white/10 text-white min-h-[150px]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase font-bold text-muted-foreground">BRD Document Content</Label>
                <Textarea 
                  value={formData.brdDocument}
                  onChange={e => setFormData({...formData, brdDocument: e.target.value})}
                  placeholder="Business goals, efficiency targets, expansion plans..."
                  className="bg-white/5 border-white/10 text-white min-h-[150px]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase font-bold text-muted-foreground">Legal & Policy Framework</Label>
                <Textarea 
                  value={formData.legalPolicyDocument}
                  onChange={e => setFormData({...formData, legalPolicyDocument: e.target.value})}
                  placeholder="Compliance requirements, data privacy, financial controls..."
                  className="bg-white/5 border-white/10 text-white min-h-[150px]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase font-bold text-muted-foreground">Strategic Proposal</Label>
                <Textarea 
                  value={formData.proposalDocument}
                  onChange={e => setFormData({...formData, proposalDocument: e.target.value})}
                  placeholder="Proposed roadmaps, vendor agreements, strategic vision..."
                  className="bg-white/5 border-white/10 text-white min-h-[150px]"
                />
              </div>
            </div>

            <div className="pt-4">
              <Button 
                onClick={handleStartAnalysis} 
                disabled={analyzing || !formData.srsDocument || !formData.brdDocument}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-black font-bold text-lg gap-2"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Orchestrating Agents...
                  </>
                ) : (
                  <>
                    <Activity className="w-5 h-5" />
                    Initialize AI Analysis
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </Button>
              {(!formData.srsDocument || !formData.brdDocument) && (
                <p className="text-[10px] text-center mt-2 text-muted-foreground uppercase tracking-widest">Please fill in at least SRS and BRD to begin</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (analyzing) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] space-y-6">
        <div className="relative">
          <Loader2 className="w-16 h-16 text-primary animate-spin" />
          <Cpu className="w-6 h-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">Multi-Agent Orchestration</h2>
          <p className="text-muted-foreground max-w-sm">Correlating SRS, BRD, Legal, and Proposal telemetry for {formData.companyName}...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] space-y-6 text-center">
        <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
          <ShieldAlert className="w-10 h-10 text-destructive" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Analysis Interrupted</h2>
          <p className="text-muted-foreground max-w-lg">{error}</p>
        </div>
        <Button onClick={() => setShowSetup(true)} className="gap-2">
          <ListRestart className="w-4 h-4" />
          Adjust Inputs
        </Button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white font-headline">Intelligence Command</h1>
          <p className="text-muted-foreground">Orchestrated analysis for {formData.companyName}.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowSetup(true)} variant="outline" size="sm" className="gap-2 bg-white/5 hover:bg-white/10 border-white/10 text-white">
            <ListRestart className="w-4 h-4" />
            Recalibrate Inputs
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 bg-card/50 backdrop-blur-sm border-primary/20 shadow-[0_0_30px_rgba(212,175,55,0.05)]">
          <CardHeader>
            <CardTitle className="text-lg">Aggregate Risk Index</CardTitle>
            <CardDescription>Synthesized Organizational Posture</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center pt-2">
            <RiskGauge score={data.overallRiskIndex} level={data.overallRiskLevel} />
          </CardContent>
        </Card>

        <Card className="md:col-span-2 bg-card/30 backdrop-blur-sm border-white/5">
          <CardHeader>
            <CardTitle className="text-lg">Domain Risk Heatmap</CardTitle>
            <CardDescription>Multi-Agent Threat Distribution</CardDescription>
          </CardHeader>
          <CardContent className="h-[240px]">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <BarChart data={domainData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                <YAxis hide domain={[0, 100]} />
                <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                  {domainData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} fillOpacity={0.8} />
                  ))}
                </Bar>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-primary" />
            Specialized Agent Cognitive Logs
          </h2>
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">5 Active Units</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {domainData.map((domain) => {
            const analysis = data.domainAnalysis[domain.id as keyof typeof data.domainAnalysis];
            
            return (
              <Card key={domain.name} className="bg-card/40 border-white/5 hover:border-primary/40 transition-all group overflow-hidden">
                <div className="h-1 w-full" style={{ backgroundColor: domain.fill }} />
                <CardHeader className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <domain.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    <Badge variant="outline" className="text-[10px] bg-white/5 border-white/10 text-white">{analysis.overallRiskScore}%</Badge>
                  </div>
                  <CardTitle className="text-sm font-bold text-white">{domain.name} Agent</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-[11px] leading-relaxed text-muted-foreground line-clamp-3 italic mb-4">
                    "{analysis.summary}"
                  </p>
                  <div className="flex flex-col gap-2">
                    <Link href={`/agents/${domain.id}`} className="inline-flex items-center gap-1 text-[10px] text-primary font-bold hover:underline">
                      COGNITIVE REVIEW <Cpu className="w-3 h-3" />
                    </Link>
                    <Link href={`/risk/${domain.id}`} className="inline-flex items-center gap-1 text-[10px] text-muted-foreground font-bold hover:text-white transition-colors">
                      FULL THREAT REPORT <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/30 border-white/5">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg text-white">Critical Anomalies</CardTitle>
              <CardDescription>Cross-Document Discrepancies</CardDescription>
            </div>
            <Activity className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-sm leading-relaxed text-muted-foreground bg-white/5 p-4 rounded-xl border border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
              {data.anomaliesSummary}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/30 border-white/5">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg text-white">Global Mitigation Plan</CardTitle>
              <CardDescription>Consolidated Strategic Roadmap</CardDescription>
            </div>
            <ShieldCheck className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.globalMitigationStrategies.map((strategy, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary shrink-0 border border-primary/20">{idx + 1}</div>
                  <span className="text-xs text-muted-foreground leading-snug">{strategy}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}