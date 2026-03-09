"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { initiateComprehensiveRiskAnalysis, InitiateComprehensiveRiskAnalysisOutput } from "@/ai/flows/initiate-comprehensive-risk-analysis";
import { mockOrganizationalData } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, AlertCircle, ShieldCheck, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function RiskCategoryPage() {
  const params = useParams();
  const category = params.category as string;
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<InitiateComprehensiveRiskAnalysisOutput | null>(null);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const result = await initiateComprehensiveRiskAnalysis(mockOrganizationalData);
        setData(result);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin text-primary" /></div>;
  }

  const categoryData = data?.domainAnalysis[category as keyof typeof data.domainAnalysis];
  if (!categoryData) return <div>Category not found.</div>;

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "Critical": return "bg-red-500 text-white";
      case "High": return "bg-orange-500 text-white";
      case "Medium": return "bg-yellow-500 text-black";
      default: return "bg-green-500 text-white";
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      <Link href="/">
        <Button variant="ghost" className="mb-4 gap-2 hover:bg-primary/10">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight capitalize font-headline">{category} Risk Analysis</h1>
          <p className="text-muted-foreground mt-2">Deep-dive into specialized {category} agent intelligence.</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-4 rounded-xl border shadow-sm">
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-muted-foreground">Domain Score</div>
            <div className="text-3xl font-bold text-primary">{categoryData.overallRiskScore}%</div>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-primary/20 flex items-center justify-center" style={{ borderTopColor: 'hsl(var(--primary))' }}>
            <span className="text-[10px] font-bold">LVL</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle>Domain Summary</CardTitle>
            <CardDescription>Synthesized finding from specialized AI agent</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed">{categoryData.summary}</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Agent Reasoning</CardTitle>
            <CardDescription>Logic behind the current assessment</CardDescription>
          </CardHeader>
          <CardContent className="text-sm italic text-muted-foreground">
             "Our {category} agent identified these risks by correlating organizational mock data points and identifying deviations from baseline efficiency metrics."
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold font-headline pt-4">Identified Risks & Anomalies</h2>
      <div className="grid grid-cols-1 gap-6">
        {categoryData.risks.map((risk, idx) => (
          <Card key={idx} className="shadow-md border-l-4 overflow-hidden" style={{ borderLeftColor: risk.impact === 'Critical' ? '#ef4444' : '#D4AF37' }}>
            <CardHeader className="bg-muted/20">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {risk.anomalyDetected ? <AlertCircle className="text-primary w-5 h-5" /> : <ShieldCheck className="text-green-500 w-5 h-5" />}
                  <CardTitle className="text-xl">{risk.name}</CardTitle>
                  {risk.anomalyDetected && <Badge variant="outline" className="text-primary border-primary">Anomaly Detected</Badge>}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="capitalize">Prob: {risk.probability}</Badge>
                  <Badge className={cn(getImpactColor(risk.impact))}>Impact: {risk.impact}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-sm font-bold uppercase text-muted-foreground mb-2 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Description & Findings
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{risk.description}</p>
                <div className="mt-4 p-4 rounded bg-muted/30 border text-xs">
                  <h5 className="font-bold mb-1">Reasoning:</h5>
                  {risk.reasoning}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold uppercase text-muted-foreground mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  Mitigation Strategy
                </h4>
                <div className="p-4 rounded bg-primary/5 border border-primary/10 text-primary font-medium">
                  {risk.mitigationStrategy}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
