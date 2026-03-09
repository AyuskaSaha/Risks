
"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { reviewAgentInsights, ReviewAgentInsightsOutput } from "@/ai/flows/review-agent-insights";
import { mockOrganizationalData } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Terminal, Cpu, Info, AlertTriangle, ChevronRight, Activity } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AgentDebugPage() {
  const params = useParams();
  const agentId = params.agentId as string;
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<ReviewAgentInsightsOutput | null>(null);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const scenario = `Perform a deep-vector audit of the ${agentId} domain for ${mockOrganizationalData.companyName}. Cross-reference the SRS, BRD, and Legal documents against the current operational telemetry.`;
        const result = await reviewAgentInsights({ 
          agentName: agentId.charAt(0).toUpperCase() + agentId.slice(1) as any, 
          scenarioDescription: scenario 
        });
        setData(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [agentId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] space-y-4">
        <div className="relative">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <Cpu className="w-5 h-5 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-muted-foreground animate-pulse">Initializing Specialized Agent Logic...</p>
      </div>
    );
  }

  if (!data) return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold">Agent Offline</h2>
      <p className="text-muted-foreground">Unable to establish cognitive link with {agentId}.</p>
      <Link href="/">
        <Button variant="link" className="text-primary mt-4">Return to Command Center</Button>
      </Link>
    </div>
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-[0_0_20px_rgba(212,175,55,0.1)]">
            <Cpu className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-headline text-white">{data.agentName} Intelligence</h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <Activity className="w-3 h-3 text-green-500" />
              Real-time cognitive reasoning stream active
            </p>
          </div>
        </div>
        <div className="flex gap-2">
           <Link href={`/risk/${agentId}`}>
            <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/10">
              View Formal Risks
            </Button>
          </Link>
          <Link href="/">
            <Button variant="ghost">Dashboard</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 bg-card/50 border-primary/10">
          <CardHeader>
            <CardTitle className="text-lg">Agent Parameters</CardTitle>
            <CardDescription>Internal scoring and impact metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col items-center">
              <span className="text-[10px] uppercase font-bold text-muted-foreground mb-1 tracking-widest">Confidence Score</span>
              <span className="text-4xl font-bold text-primary">{(data.predictedProbability * 100).toFixed(0)}%</span>
            </div>
            
            <div className="space-y-3 pt-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Detected Anomalies</span>
                <span className="font-bold text-white">{data.detectedAnomalies.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Operational</Badge>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5">
              <h5 className="text-[10px] font-bold uppercase text-muted-foreground mb-3 tracking-widest">Impact Assessment</h5>
              <div className="text-sm leading-relaxed p-3 rounded-lg bg-primary/5 text-primary/80 italic border border-primary/5">
                "{data.impactAssessment}"
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 bg-card/30 border-white/5">
          <CardHeader>
            <CardTitle className="text-lg">Cognitive Reasoning Chain</CardTitle>
            <CardDescription>Step-by-step logic used by the agent to reach its conclusions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {data.reasoningChain.map((step, idx) => (
                <div key={idx} className="flex gap-4 group">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary shrink-0 group-hover:bg-primary group-hover:text-black transition-all">
                      {idx + 1}
                    </div>
                    {idx < data.reasoningChain.length - 1 && <div className="w-px grow bg-gradient-to-b from-primary/30 to-transparent mt-2" />}
                  </div>
                  <div className="pb-6">
                    <p className="text-sm leading-relaxed text-foreground/70 group-hover:text-foreground transition-colors">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="anomalies" className="w-full">
        <TabsList className="bg-muted/50 p-1 mb-4 border border-white/5">
          <TabsTrigger value="anomalies" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-black"><AlertTriangle className="w-4 h-4" /> Anomaly Ledger</TabsTrigger>
          <TabsTrigger value="mitigation" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-black"><Info className="w-4 h-4" /> Agent Recommendations</TabsTrigger>
          <TabsTrigger value="raw" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-black"><Terminal className="w-4 h-4" /> Raw System Output</TabsTrigger>
        </TabsList>
        
        <TabsContent value="anomalies">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.detectedAnomalies.map((anomaly, idx) => (
              <Card key={idx} className="bg-card/40 border-white/5 hover:border-primary/40 transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-bold text-white">{anomaly.description}</CardTitle>
                  <Badge variant={anomaly.severity === 'High' ? 'destructive' : 'outline'} className="text-[10px]">
                    {anomaly.severity}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground leading-relaxed">{anomaly.impact}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="mitigation">
          <div className="grid grid-cols-1 gap-4">
            {data.mitigationStrategies.map((strategy, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary shrink-0 border border-primary/20">
                  {idx + 1}
                </div>
                <p className="text-sm text-foreground/80">{strategy}</p>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="raw">
          <Card className="shadow-xl border-0 bg-black text-white">
            <CardContent className="p-6">
              <pre className="font-code text-[10px] overflow-auto leading-relaxed max-h-[400px] text-primary/60 scrollbar-thin scrollbar-thumb-primary/20">
                {JSON.stringify(data.rawGenAIOutput, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
