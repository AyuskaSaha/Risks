
"use client";

import * as React from "react";
import { initiateComprehensiveRiskAnalysis, InitiateComprehensiveRiskAnalysisOutput } from "@/ai/flows/initiate-comprehensive-risk-analysis";
import { mockOrganizationalData } from "@/lib/mock-data";
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
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { 
  Bar, 
  BarChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Cell
} from "recharts";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [data, setData] = React.useState<InitiateComprehensiveRiskAnalysisOutput | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await initiateComprehensiveRiskAnalysis(mockOrganizationalData);
      setData(result);
    } catch (e: any) {
      setError(e.message || "Analysis Interrupted");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] space-y-6">
        <div className="relative">
          <Loader2 className="w-16 h-16 text-primary animate-spin" />
          <Cpu className="w-6 h-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">Multi-Agent Orchestration</h2>
          <p className="text-muted-foreground max-w-sm">Correlating SRS, BRD, and Legal docs with operational telemetry...</p>
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
        <Button onClick={fetchData} className="gap-2">
          <ListRestart className="w-4 h-4" />
          Retry Orchestration
        </Button>
      </div>
    );
  }

  if (!data) return null;

  const domainData = [
    { id: 'financial', name: "Financial", score: data.domainAnalysis.financial.overallRiskScore, fill: "hsl(var(--chart-1))", icon: TrendingUp },
    { id: 'cybersecurity', name: "Cyber", score: data.domainAnalysis.cybersecurity.overallRiskScore, fill: "hsl(var(--chart-2))", icon: ShieldCheck },
    { id: 'operational', name: "Operational", score: data.domainAnalysis.operational.overallRiskScore, fill: "hsl(var(--chart-3))", icon: Zap },
    { id: 'compliance', name: "Compliance", score: data.domainAnalysis.compliance.overallRiskScore, fill: "hsl(var(--chart-4))", icon: Scale },
    { id: 'strategicMarket', name: "Strategic", score: data.domainAnalysis.strategicMarket.overallRiskScore, fill: "hsl(var(--chart-5))", icon: Globe },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white font-headline">Intelligence Command</h1>
          <p className="text-muted-foreground">Orchestrated analysis for {mockOrganizationalData.companyName}.</p>
        </div>
        <div className="flex gap-2">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center" title="SRS Loaded"><FileText className="w-4 h-4 text-blue-400" /></div>
            <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center" title="BRD Loaded"><FileText className="w-4 h-4 text-purple-400" /></div>
            <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center" title="Legal Loaded"><Scale className="w-4 h-4 text-green-400" /></div>
          </div>
          <Button onClick={fetchData} variant="outline" size="sm" className="gap-2 bg-white/5 hover:bg-white/10 border-white/10 text-white">
            <ListRestart className="w-4 h-4" />
            Recalibrate
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
            <ResponsiveContainer width="100%" height="100%">
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
            </ResponsiveContainer>
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
