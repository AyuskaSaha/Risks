"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { reviewAgentInsights, ReviewAgentInsightsOutput } from "@/ai/flows/review-agent-insights";
import { mockOrganizationalData } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Terminal, Cpu, Info, AlertTriangle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AgentDebugPage() {
  const params = useParams();
  const agentId = params.agentId as any;
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<ReviewAgentInsightsOutput | null>(null);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const scenario = `Analyze the current ${agentId} posture based on the organizational mock data for ${mockOrganizationalData.companyName}.`;
        const result = await reviewAgentInsights({ agentName: agentId, scenarioDescription: scenario });
        setData(result);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [agentId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-muted-foreground">Accessing Agent Memory & Logic...</p>
      </div>
    );
  }

  if (!data) return <div>Agent not found.</div>;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white">
          <Cpu className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-headline">{data.agentName} Risk Agent</h1>
          <p className="text-muted-foreground">Internal Agent Reasoning & Raw Diagnostics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 shadow-sm border-primary/20">
          <CardHeader>
            <CardTitle>Agent Status</CardTitle>
            <CardDescription>Real-time diagnostic metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Predicted Probability</span>
              <span className="font-bold">{(data.predictedProbability * 100).toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Anomalies Detected</span>
              <Badge variant="outline">{data.detectedAnomalies.length}</Badge>
            </div>
            <div className="pt-4 border-t">
              <h5 className="text-xs font-bold uppercase text-muted-foreground mb-2">Impact Assessment</h5>
              <p className="text-sm">{data.impactAssessment}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle>Reasoning Chain</CardTitle>
            <CardDescription>Step-by-step cognitive breakdown of the agent's logic</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {data.reasoningChain.map((step, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold shrink-0">
                      {idx + 1}
                    </div>
                    {idx < data.reasoningChain.length - 1 && <div className="w-0.5 grow bg-muted mt-2" />}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm leading-relaxed text-muted-foreground">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="anomalies" className="w-full">
        <TabsList className="bg-muted/50 p-1 mb-4">
          <TabsTrigger value="anomalies" className="gap-2"><AlertTriangle className="w-4 h-4" /> Detected Anomalies</TabsTrigger>
          <TabsTrigger value="raw" className="gap-2"><Terminal className="w-4 h-4" /> Raw JSON Output</TabsTrigger>
        </TabsList>
        <TabsContent value="anomalies">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.detectedAnomalies.map((anomaly, idx) => (
              <Card key={idx} className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-bold">{anomaly.description}</CardTitle>
                  <Badge variant={anomaly.severity === 'High' ? 'destructive' : 'outline'}>{anomaly.severity}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{anomaly.impact}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="raw">
          <Card className="shadow-sm border-0 bg-[#1A1A1A] text-white">
            <CardContent className="p-6">
              <pre className="font-code text-xs overflow-auto leading-relaxed h-[400px] text-primary/80">
                {JSON.stringify(data.rawGenAIOutput, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
