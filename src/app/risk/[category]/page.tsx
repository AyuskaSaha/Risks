
"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { initiateComprehensiveRiskAnalysis, InitiateComprehensiveRiskAnalysisOutput } from "@/ai/flows/initiate-comprehensive-risk-analysis";
import { generateMitigationPlan, MitigationPlanOutput } from "@/ai/flows/generate-mitigation-plan";
import { mockOrganizationalData } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, AlertCircle, ShieldCheck, Activity, ClipboardCheck, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function RiskCategoryPage() {
  const params = useParams();
  const category = params.category as string;
  const [loading, setLoading] = React.useState(true);
  const [planningRisk, setPlanningRisk] = React.useState<any | null>(null);
  const [planLoading, setPlanLoading] = React.useState(false);
  const [plan, setPlan] = React.useState<MitigationPlanOutput | null>(null);
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

  const handleGeneratePlan = async (risk: any) => {
    setPlanningRisk(risk);
    setPlanLoading(true);
    setPlan(null);
    try {
      const result = await generateMitigationPlan({
        riskName: risk.name,
        riskDescription: risk.description,
        domain: category,
        severity: risk.impact,
      });
      setPlan(result);
    } catch (error) {
      console.error("Plan generation failed", error);
    } finally {
      setPlanLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-muted-foreground font-medium">Analyzing {category} data vector...</p>
      </div>
    );
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
        <Card className="md:col-span-2 shadow-lg border-primary/10">
          <CardHeader>
            <CardTitle>Domain Summary</CardTitle>
            <CardDescription>Synthesized finding from specialized AI agent</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed text-foreground/80">{categoryData.summary}</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Agent Reasoning</CardTitle>
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
          <Card key={idx} className="shadow-md border-l-4 overflow-hidden transition-all hover:shadow-xl" style={{ borderLeftColor: risk.impact === 'Critical' ? '#ef4444' : '#D4AF37' }}>
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
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-sm font-bold uppercase text-muted-foreground mb-3 flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Description & Findings
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{risk.description}</p>
                  <div className="p-4 rounded-lg bg-muted/30 border text-xs">
                    <h5 className="font-bold mb-1">AI Reasoning Chain:</h5>
                    <p className="text-muted-foreground italic">{risk.reasoning}</p>
                  </div>
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold uppercase text-muted-foreground mb-3 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" />
                      Mitigation Strategy
                    </h4>
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 text-primary font-medium text-sm">
                      {risk.mitigationStrategy}
                    </div>
                  </div>
                  <Button 
                    className="mt-6 w-full gap-2 bg-primary hover:bg-primary/90" 
                    onClick={() => handleGeneratePlan(risk)}
                  >
                    <Sparkles className="w-4 h-4" />
                    Generate Actionable Project Plan
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!planningRisk} onOpenChange={(open) => !open && setPlanningRisk(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ClipboardCheck className="w-6 h-6 text-primary" />
              Mitigation Project Plan
            </DialogTitle>
            <DialogDescription>
              AI-generated roadmap for: <span className="font-bold text-foreground">{planningRisk?.name}</span>
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="mt-4 pr-4 h-full max-h-[60vh]">
            {planLoading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground">Architecting mitigation strategy...</p>
              </div>
            ) : plan ? (
              <div className="space-y-8 pb-6">
                <section>
                  <h4 className="text-xs font-bold uppercase text-primary mb-2">Primary Objective</h4>
                  <p className="text-sm bg-primary/5 p-3 rounded-lg border border-primary/10">{plan.objective}</p>
                </section>

                <section className="space-y-6">
                  <h4 className="text-xs font-bold uppercase text-muted-foreground">Execution Phases</h4>
                  <div className="space-y-4">
                    {plan.phases.map((phase, i) => (
                      <div key={i} className="relative pl-6 border-l-2 border-muted pb-4 last:pb-0">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-white shadow-sm" />
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-bold text-sm">{phase.name}</h5>
                          <Badge variant="secondary" className="text-[10px]">{phase.timeline}</Badge>
                        </div>
                        <ul className="space-y-2 mb-3">
                          {phase.steps.map((step, si) => (
                            <li key={si} className="text-xs text-muted-foreground flex gap-2">
                              <span className="text-primary mt-0.5">•</span>
                              {step}
                            </li>
                          ))}
                        </ul>
                        <div className="text-[10px] font-bold text-muted-foreground/60 uppercase">Owner: {phase.owner}</div>
                      </div>
                    ))}
                  </div>
                </section>

                <div className="grid grid-cols-2 gap-6">
                  <section>
                    <h4 className="text-xs font-bold uppercase text-muted-foreground mb-3">Required Resources</h4>
                    <ul className="space-y-2">
                      {plan.requiredResources.map((res, i) => (
                        <li key={i} className="text-xs bg-muted/50 p-2 rounded border">{res}</li>
                      ))}
                    </ul>
                  </section>
                  <section>
                    <h4 className="text-xs font-bold uppercase text-muted-foreground mb-3">Success KPIs</h4>
                    <ul className="space-y-2">
                      {plan.kpis.map((kpi, i) => (
                        <li key={i} className="text-xs bg-green-50 text-green-700 p-2 rounded border border-green-100">{kpi}</li>
                      ))}
                    </ul>
                  </section>
                </div>
              </div>
            ) : null}
          </ScrollArea>
          
          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => setPlanningRisk(null)}>Close Plan</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
