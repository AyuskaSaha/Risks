
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
  Cpu,
  TrendingUp,
  Scale,
  Globe,
  UploadCloud,
  ChevronRight,
  FileText,
  Zap,
  CheckCircle2,
  AlertCircle
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockOrganizationalData } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

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
  const [analyzing, setAnalyzing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [data, setData] = React.useState<InitiateComprehensiveRiskAnalysisOutput | null>(null);
  const [showSetup, setShowSetup] = React.useState(true);

  // Simulation state for uploaded files
  const [uploadedFiles, setUploadedFiles] = React.useState<{
    srs: boolean;
    brd: boolean;
    legal: boolean;
    proposal: boolean;
  }>({
    srs: false,
    brd: false,
    legal: false,
    proposal: false,
  });

  const [formData, setFormData] = React.useState<InitiateComprehensiveRiskAnalysisInput>({
    companyName: "Acme Corp",
    srsDocument: "",
    brdDocument: "",
    legalPolicyDocument: "",
    proposalDocument: "",
  });

  const handleFileUpload = (type: keyof typeof uploadedFiles) => {
    // In a real app, we'd use a PDF parser here. 
    // For the prototype, we simulate the success and populate the state with mock text.
    setUploadedFiles(prev => ({ ...prev, [type]: true }));
    setFormData(prev => ({
      ...prev,
      [type === 'srs' ? 'srsDocument' : type === 'brd' ? 'brdDocument' : type === 'legal' ? 'legalPolicyDocument' : 'proposalDocument']: 
      mockOrganizationalData[type === 'srs' ? 'srsDocument' : type === 'brd' ? 'brdDocument' : type === 'legal' ? 'legalPolicyDocument' : 'proposalDocument' as keyof typeof mockOrganizationalData] as string
    }));
  };

  const handleLoadSample = () => {
    setFormData(mockOrganizationalData);
    setUploadedFiles({
      srs: true,
      brd: true,
      legal: true,
      proposal: true,
    });
  };

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
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
        <div className="text-center space-y-4">
          <Badge variant="outline" className="border-primary/40 text-primary px-4 py-1 rounded-full text-[10px] tracking-widest uppercase font-bold">
            Secure Intelligence Node
          </Badge>
          <h1 className="text-5xl font-extrabold tracking-tight text-white font-headline">Intelligence Setup</h1>
          <p className="text-muted-foreground text-lg">Upload core organizational PDFs to initialize multi-agent risk orchestration.</p>
        </div>

        <Card className="bg-card/50 border-primary/20 shadow-2xl overflow-hidden backdrop-blur-md">
          <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-2 text-white">
                  <UploadCloud className="w-5 h-5 text-primary" />
                  Strategic Document Ingestion
                </CardTitle>
                <CardDescription>System accepts PDF, DOCX, and TXT formats for vector analysis.</CardDescription>
              </div>
              <Button onClick={handleLoadSample} variant="outline" size="sm" className="text-[10px] font-bold border-primary/20 hover:bg-primary/10 h-8">
                LOAD SAMPLE STRATEGY PACK
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-8 pt-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Target Organization</Label>
                <Input 
                  value={formData.companyName} 
                  onChange={e => setFormData({...formData, companyName: e.target.value})}
                  placeholder="e.g., Global Horizon Logistics"
                  className="bg-white/5 border-white/10 text-white h-12 text-lg focus:border-primary/50 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 'srs', label: 'Software Requirements (SRS)', icon: FileText, color: 'text-blue-400' },
                  { id: 'brd', label: 'Business Requirements (BRD)', icon: FileText, color: 'text-purple-400' },
                  { id: 'legal', label: 'Legal & Policy Framework', icon: Scale, color: 'text-green-400' },
                  { id: 'proposal', label: 'Strategic Roadmap Proposal', icon: Globe, color: 'text-orange-400' },
                ].map((doc) => (
                  <div key={doc.id} className="relative group">
                    <div className={cn(
                      "flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed transition-all h-[160px] cursor-pointer",
                      uploadedFiles[doc.id as keyof typeof uploadedFiles] 
                        ? "bg-primary/5 border-primary/40" 
                        : "bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10"
                    )}
                    onClick={() => document.getElementById(`file-${doc.id}`)?.click()}
                    >
                      <input 
                        type="file" 
                        id={`file-${doc.id}`} 
                        className="hidden" 
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={() => handleFileUpload(doc.id as any)}
                      />
                      {uploadedFiles[doc.id as keyof typeof uploadedFiles] ? (
                        <div className="flex flex-col items-center gap-2 animate-in zoom-in-95 duration-300">
                          <CheckCircle2 className="w-10 h-10 text-primary" />
                          <span className="text-xs font-bold text-white uppercase tracking-tighter">{doc.id.toUpperCase()} Processed</span>
                          <span className="text-[10px] text-muted-foreground">Document vector extracted</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-3">
                          <doc.icon className={cn("w-10 h-10 opacity-40 group-hover:opacity-100 transition-opacity", doc.color)} />
                          <span className="text-sm font-medium text-muted-foreground text-center">{doc.label}</span>
                          <Badge variant="secondary" className="text-[9px] bg-white/10">SELECT PDF</Badge>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <Button 
                onClick={handleStartAnalysis} 
                disabled={analyzing || !uploadedFiles.srs || !uploadedFiles.brd}
                className="w-full h-14 bg-primary hover:bg-primary/90 text-black font-bold text-xl gap-3 shadow-[0_0_30px_rgba(212,175,55,0.2)] rounded-xl group"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Correlating Global Vectors...
                  </>
                ) : (
                  <>
                    <Activity className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    Initialize Multi-Agent Orchestration
                    <ChevronRight className="w-6 h-6" />
                  </>
                )}
              </Button>
              <div className="flex items-center justify-center gap-2 mt-4 text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">
                <ShieldAlert className="w-3 h-3" />
                System requires SRS and BRD minimum for baseline correlation
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (analyzing) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] space-y-8 animate-in fade-in duration-1000">
        <div className="relative">
          <div className="w-32 h-32 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          <Cpu className="w-10 h-10 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-white font-headline tracking-tight">Orchestrating AI Agents</h2>
          <div className="flex items-center justify-center gap-4">
            {['Financial', 'Cyber', 'Ops', 'Legal', 'Market'].map((a, i) => (
              <div key={a} className="flex flex-col items-center gap-2" style={{ animationDelay: `${i * 150}ms` }}>
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                <span className="text-[10px] text-muted-foreground font-bold uppercase">{a}</span>
              </div>
            ))}
          </div>
          <p className="text-muted-foreground max-w-sm mx-auto text-sm leading-relaxed">
            Correlating document inconsistencies across {formData.companyName}'s strategic framework...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] space-y-6 text-center">
        <div className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center border border-destructive/20 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
          <AlertCircle className="w-12 h-12 text-destructive" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-white">Intelligence Failure</h2>
          <p className="text-muted-foreground max-w-lg text-lg">{error}</p>
        </div>
        <Button onClick={() => setShowSetup(true)} className="gap-2 h-12 px-8 bg-white/10 hover:bg-white/20 border-white/10 text-white rounded-xl">
          <ListRestart className="w-5 h-5" />
          Re-Upload Strategic Pack
        </Button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge className="bg-primary/20 text-primary border-primary/20 text-[10px] font-bold">LIVE ANALYSIS</Badge>
            <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Node: Alpha-7</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white font-headline">Intelligence Command</h1>
          <p className="text-muted-foreground">Strategic posture review for {formData.companyName}.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowSetup(true)} variant="outline" size="sm" className="gap-2 bg-white/5 hover:bg-white/10 border-white/10 text-white h-10 px-4 rounded-lg">
            <ListRestart className="w-4 h-4" />
            Recalibrate Input Documents
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 bg-card/50 backdrop-blur-sm border-primary/20 shadow-[0_0_30px_rgba(212,175,55,0.05)] rounded-2xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg">Aggregate Risk Index</CardTitle>
            <CardDescription>Synthesized Organizational Posture</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center pt-2">
            <RiskGauge score={data.overallRiskIndex} level={data.overallRiskLevel} />
          </CardContent>
        </Card>

        <Card className="md:col-span-2 bg-card/30 backdrop-blur-sm border-white/5 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg">Domain Risk Heatmap</CardTitle>
            <CardDescription>Multi-Agent Threat Distribution Across Pillars</CardDescription>
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
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">5 Active Units In-Sync</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {domainData.map((domain) => {
            const analysis = data.domainAnalysis[domain.id as keyof typeof data.domainAnalysis];
            
            return (
              <Card key={domain.name} className="bg-card/40 border-white/5 hover:border-primary/40 transition-all group overflow-hidden rounded-xl">
                <div className="h-1 w-full" style={{ backgroundColor: domain.fill }} />
                <CardHeader className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <domain.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    <Badge variant="outline" className="text-[10px] bg-white/5 border-white/10 text-white">{analysis.overallRiskScore}%</Badge>
                  </div>
                  <CardTitle className="text-sm font-bold text-white">{domain.name} Agent</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-[11px] leading-relaxed text-muted-foreground line-clamp-3 italic mb-4 h-[45px]">
                    "{analysis.summary}"
                  </p>
                  <div className="flex flex-col gap-2 border-t border-white/5 pt-4">
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
        <Card className="bg-card/30 border-white/5 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg text-white">Cross-Document Anomalies</CardTitle>
              <CardDescription>Discrepancies identified between SRS, BRD, and Legal</CardDescription>
            </div>
            <Activity className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-sm leading-relaxed text-muted-foreground bg-white/5 p-4 rounded-xl border border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary shadow-[0_0_15px_rgba(212,175,55,0.5)]" />
              {data.anomaliesSummary}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/30 border-white/5 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg text-white">Global Mitigation Plan</CardTitle>
              <CardDescription>Consolidated Strategic Roadmap for Leadership</CardDescription>
            </div>
            <ShieldCheck className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.globalMitigationStrategies.map((strategy, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary shrink-0 border border-primary/20">{idx + 1}</div>
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
