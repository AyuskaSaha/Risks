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
  ShieldAlert
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
      console.error("Dashboard error:", e);
      setError(e.message || "An unexpected error occurred while orchestrating agents.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <div className="text-center">
          <h2 className="text-xl font-semibold">Orchestrating Risk Agents...</h2>
          <p className="text-muted-foreground max-w-md mx-auto">Connecting to Financial, Cyber, Operational, Compliance, and Strategic LLM agents for deep-vector analysis.</p>
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
          <h2 className="text-2xl font-bold">Analysis Interrupted</h2>
          <p className="text-muted-foreground max-w-lg">{error}</p>
        </div>
        <Button onClick={fetchData} className="gap-2">
          <ListRestart className="w-4 h-4" />
          Retry Analysis
        </Button>
      </div>
    );
  }

  if (!data) return <div>No data available.</div>;

  const domainData = [
    { name: "Financial", score: data.domainAnalysis.financial.overallRiskScore, fill: "hsl(var(--chart-1))" },
    { name: "Cyber", score: data.domainAnalysis.cybersecurity.overallRiskScore, fill: "hsl(var(--chart-2))" },
    { name: "Operational", score: data.domainAnalysis.operational.overallRiskScore, fill: "hsl(var(--chart-3))" },
    { name: "Compliance", score: data.domainAnalysis.compliance.overallRiskScore, fill: "hsl(var(--chart-4))" },
    { name: "Strategic", score: data.domainAnalysis.strategicMarket.overallRiskScore, fill: "hsl(var(--chart-5))" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Risk Intelligence Dashboard</h1>
          <p className="text-muted-foreground">Real-time multi-agent analysis for {mockOrganizationalData.companyName}.</p>
        </div>
        <Button onClick={fetchData} variant="outline" className="gap-2">
          <ListRestart className="w-4 h-4" />
          Refresh Analysis
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 shadow-md border-primary/20">
          <CardHeader>
            <CardTitle>Overall Risk Index</CardTitle>
            <CardDescription>Synthesized organizational risk score</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center pt-2">
            <RiskGauge score={data.overallRiskIndex} level={data.overallRiskLevel} />
          </CardContent>
        </Card>

        <Card className="md:col-span-2 shadow-md">
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
            <CardDescription>Individual risk scores across operational domains</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={domainData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis hide domain={[0, 100]} />
                <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                  {domainData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Anomaly Detection Summary</CardTitle>
              <CardDescription>Critical findings across all domains</CardDescription>
            </div>
            <Activity className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground bg-muted/30 p-4 rounded-lg border">
              {data.anomaliesSummary}
            </p>
            <div className="mt-6 space-y-4">
               {Object.entries(data.domainAnalysis).map(([key, domain]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">{key}</span>
                    <Badge variant={domain.overallRiskScore > 70 ? "destructive" : "secondary"}>
                      {domain.overallRiskScore}%
                    </Badge>
                  </div>
               ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Global Mitigation Strategies</CardTitle>
              <CardDescription>High-level strategic recommendations</CardDescription>
            </div>
            <ShieldCheck className="w-5 h-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {data.globalMitigationStrategies.map((strategy, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>{strategy}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Top Detected Risks</CardTitle>
          <CardDescription>Prioritized list of identified threats</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(data.domainAnalysis).flatMap(([domainKey, domain]) => 
              domain.risks.filter(r => r.impact === "Critical" || r.probability === "High").map((risk, idx) => (
                <div key={`${domainKey}-${idx}`} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "p-2 rounded-full",
                      risk.impact === "Critical" ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-600"
                    )}>
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{risk.name}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-1">{risk.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="hidden md:block text-right">
                      <div className="text-[10px] uppercase font-bold text-muted-foreground">Domain</div>
                      <div className="text-xs font-medium capitalize">{domainKey}</div>
                    </div>
                    <Badge variant={risk.impact === "Critical" ? "destructive" : "secondary"}>{risk.impact}</Badge>
                    <Link href={`/risk/${domainKey}`}>
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            ).slice(0, 5)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
