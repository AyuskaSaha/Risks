
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
    companyName: "Global Horizon Logistics",
    srsDocument: "",
    brdDocument: "",
    legalPolicyDocument: "",
    proposalDocument: "",
  });

  const handleFileUpload = (type: keyof typeof uploadedFiles) => {
    const fieldMapping = {
      srs: 'srsDocument',
      brd: 'brdDocument',
      legal: 'legalPolicyDocument',
      proposal: 'proposalDocument'
    } as const;

    const mockField = fieldMapping[type];
    
    setUploadedFiles(prev => ({ ...prev, [type]: true }));
    setFormData(prev => ({
      ...prev,
      [mockField]: mockOrganizationalData[mockField] as string
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
    if (!formData.srsDocument || !formData.brdDocument || !formData.legalPolicyDocument || !formData.proposalDocument) {
      setError("Strategic baseline incomplete. Please upload all 4 required pillars.");
      return;
    }

    setAnalyzing(true);
    setError(null);
    try {
      const result = await initiateComprehensiveRiskAnalysis(formData);
      setData(result);
      setShowSetup(false);
    } catch (e: any) {
      console.error("Analysis failure:", e);
      const message = e.message?.includes("Required JSON schema") 
        ? "Strategic Pillar Validation Failed: One or more documents contained insufficient context for analysis."
        : e.message || "Risk Agent Orchestration failed.";
      setError(message);
    } finally {
      setAnalyzing(false);
    }
  };

  const allFilesUploaded = uploadedFiles.srs && uploadedFiles.brd && uploadedFiles.legal && uploadedFiles.proposal;

  const domainData = data ? [
    { id: 'financial', name: "Financial", score: data.domainAnalysis.financial.overallRiskScore, fill: "hsl(var(--chart-1))", icon: TrendingUp },
    { id: 'cybersecurity', name: "Cyber", score: data.domainAnalysis.cybersecurity.overallRiskScore, fill: "hsl(var(--chart-2))", icon: ShieldCheck },
    { id: 'operational', name: "Operational", score: data.domainAnalysis.operational.overallRiskScore, fill: "hsl(var(--chart-3))", icon: Zap },
    { id: 'compliance', name: "Compliance", score: data.domainAnalysis.compliance.overallRiskScore, fill: "hsl(var(--chart-4))", icon: Scale },
    { id: 'strategicMarket', name: "Strategic", score: data.domainAnalysis.strategicMarket.overallRiskScore, fill: "hsl(var(--chart-5))", icon: Globe },
  ] : [];

  if (analyzing) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] space-y-8 animate-in fade-in duration-700">
        <div className="relative">
          <div className="w-40 h-40 rounded-full border-2 border-primary/10 border-t-primary animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Cpu className="w-12 h-12 text-primary animate-pulse" />
          </div>
        </div>
        <div className="text-center space-y-4 max-w-lg">
          <h2 className="text-3xl font-bold text-white font-headline tracking-tight">Synchronizing Agents</h2>
          <div className="flex items-center justify-center gap-4">
            {['Financial', 'Cyber', 'Operational', 'Compliance', 'Strategic'].map((a, i) => (
              <div key={a} className="flex flex-col items-center gap-2" style={{ animationDelay: `${i * 150}ms` }}>
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">{a}</span>
              </div>
            ))}
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Correlating document pillars to identify cross-domain contradictions for {formData.companyName}...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] space-y-6 text-center animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center border border-destructive/20 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
          <AlertCircle className="w-12 h-12 text-destructive" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-white">System Error</h2>
          <p className="text-muted-foreground max-w-lg text-lg">{error}</p>
        </div>
        <Button onClick={() => { setError(null); setShowSetup(true); }} className="gap-2 h-12 px-8 bg-white/10 hover:bg-white/20 border-white/10 text-white rounded-xl">
          <ListRestart className="w-5 h-5" />
          Recalibrate & Retry
        </Button>
      </div>
    );
  }

  if (showSetup) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-top-4 duration-1000 pb-20">
        <div className="text-center space-y-4">
          <Badge variant="outline" className="border-primary/40 text-primary px-4 py-1 rounded-full text-[10px] tracking-widest uppercase font-bold">
            IntelliRisk Alpha Core
          </Badge>
          <h1 className="text-6xl font-extrabold tracking-tighter text-white font-headline">Strategic Ingestion</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Upload your organizational pillars to initialize multi-agent vector correlation.
          </p>
        </div>

        <Card className="bg-card/50 border-primary/20 shadow-2xl overflow-hidden backdrop-blur-md">
          <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
          <CardHeader className="pb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl flex items-center gap-2 text-white">
                  <UploadCloud className="w-5 h-5 text-primary" />
                  Context Document Gateway
                </CardTitle>
                <CardDescription>All 4 pillars are required for deep correlation analysis.</CardDescription>
              </div>
              <Button onClick={handleLoadSample} variant="outline" size="sm" className="text-[10px] font-bold border-primary/20 hover:bg-primary/10 h-9 px-4">
                LOAD SAMPLE ENTERPRISE DATA
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-8 pt-0">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest pl-1">Target Organization</Label>
                <Input 
                  value={formData.companyName} 
                  onChange={e => setFormData({...formData, companyName: e.target.value})}
                  placeholder="e.g., Global Horizon Logistics"
                  className="bg-white/5 border-white/10 text-white h-14 text-xl focus:border-primary/50 transition-all rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 'srs', label: 'SRS (Software Specs)', icon: FileText, color: 'text-blue-400' },
                  { id: 'brd', label: 'BRD (Business Goals)', icon: FileText, color: 'text-purple-400' },
                  { id: 'legal', label: 'Legal & Policy Framework', icon: Scale, color: 'text-green-400' },
                  { id: 'proposal', label: 'Strategic Proposal', icon: Globe, color: 'text-orange-400' },
                ].map((doc) => (
                  <div key={doc.id} className="relative group">
                    <div className={cn(
                      "flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed transition-all h-[180px] cursor-pointer",
                      uploadedFiles[doc.id as keyof typeof uploadedFiles] 
                        ? "bg-primary/5 border-primary/40 shadow-[inset_0_0_20px_rgba(212,175,55,0.05)]" 
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
                        <div className="flex flex-col items-center gap-2 animate-in zoom-in-95 duration-500">
                          <CheckCircle2 className="w-12 h-12 text-primary" />
                          <span className="text-xs font-black text-white uppercase tracking-tighter">{doc.id.toUpperCase()} UPLOADED</span>
                          <span className="text-[10px] text-muted-foreground">Vector extraction successful</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                            <doc.icon className={cn("w-6 h-6 opacity-40 group-hover:opacity-100 transition-opacity", doc.color)} />
                          </div>
                          <span className="text-sm font-semibold text-muted-foreground text-center">{doc.label}</span>
                          <Badge variant="secondary" className="text-[9px] bg-white/10 font-bold px-3">BROWSE PDF</Badge>
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
                disabled={analyzing || !allFilesUploaded}
                className="w-full h-16 bg-primary hover:bg-primary/90 text-black font-black text-xl gap-3 shadow-[0_10px_40px_rgba(212,175,55,0.2)] rounded-2xl group transition-all hover:-translate-y-1"
              >
                <Activity className="w-7 h-7 group-hover:scale-110 transition-transform" />
                INITIALIZE MULTI-AGENT ORCHESTRATION
                <ChevronRight className="w-7 h-7" />
              </Button>
              <div className="flex items-center justify-center gap-2 mt-6 text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-black">
                <ShieldAlert className="w-4 h-4 text-primary" />
                Required Pillars: {Object.values(uploadedFiles).filter(Boolean).length}/4 Verified
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Badge className="bg-primary/20 text-primary border-primary/20 text-[10px] font-black tracking-widest">LIVE ORCHESTRATION</Badge>
            <span className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">Node: INTELLIRISK-ALPHA-7</span>
          </div>
          <h1 className="text-5xl font-black tracking-tight text-white font-headline">Threat Command</h1>
          <p className="text-muted-foreground text-lg">Synthesized risk profile for <span className="text-white font-bold">{formData.companyName}</span>.</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setShowSetup(true)} variant="outline" size="lg" className="gap-2 bg-white/5 hover:bg-white/10 border-white/10 text-white h-12 px-6 rounded-xl font-bold">
            <ListRestart className="w-5 h-5" />
            Recalibrate Strategic Pillars
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 bg-card/50 backdrop-blur-xl border-primary/20 shadow-[0_0_50px_rgba(212,175,55,0.08)] rounded-3xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Aggregate Risk Index</CardTitle>
            <CardDescription>Synthesized Global Organizational Posture</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <RiskGauge score={data.overallRiskIndex} level={data.overallRiskLevel} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 bg-card/30 backdrop-blur-md border-white/5 rounded-3xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Domain Risk Heatmap</CardTitle>
            <CardDescription>Threat Density Across Organizational Pillars</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <BarChart data={domainData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 700}} />
                <YAxis hide domain={[0, 100]} />
                <Bar dataKey="score" radius={[8, 8, 0, 0]} barSize={50}>
                  {domainData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} fillOpacity={0.9} />
                  ))}
                </Bar>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-primary" />
            </div>
            Active Agent Cognitive Stream
          </h2>
          <span className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-black bg-white/5 px-4 py-1.5 rounded-full border border-white/5">5 Units Synchronized</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {domainData.map((domain) => {
            const analysis = data.domainAnalysis[domain.id as keyof typeof data.domainAnalysis];
            
            return (
              <Card key={domain.name} className="bg-card/40 border-white/5 hover:border-primary/40 transition-all group overflow-hidden rounded-2xl cursor-pointer">
                <div className="h-1.5 w-full transition-all group-hover:h-3" style={{ backgroundColor: domain.fill }} />
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <domain.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <Badge variant="outline" className="text-xs font-black bg-white/5 border-white/10 text-white px-2 py-0.5">
                      {analysis.overallRiskScore}%
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-bold text-white group-hover:text-primary transition-colors">{domain.name} Unit</CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-0">
                  <p className="text-[11px] leading-relaxed text-muted-foreground line-clamp-4 italic mb-6 h-[60px] group-hover:text-foreground transition-colors">
                    "{analysis.summary}"
                  </p>
                  <div className="flex flex-col gap-3 border-t border-white/5 pt-5">
                    <Link href={`/agents/${domain.id}`} className="inline-flex items-center justify-between w-full group/link">
                      <span className="text-[10px] text-primary font-black uppercase tracking-wider">Cognitive Logs</span>
                      <Cpu className="w-3.5 h-3.5 text-primary group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                    <Link href={`/risk/${domain.id}`} className="inline-flex items-center justify-between w-full group/link">
                      <span className="text-[10px] text-muted-foreground font-black uppercase tracking-wider group-hover:text-white transition-colors">Threat Report</span>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/30 border-white/5 rounded-3xl shadow-xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <AlertTriangle className="w-24 h-24 text-primary" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-white">Document Correlation Anomalies</CardTitle>
              <CardDescription>Discrepancies identified between your 4 strategic pillars</CardDescription>
            </div>
            <Activity className="w-6 h-6 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-sm leading-relaxed text-muted-foreground bg-white/5 p-6 rounded-2xl border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-primary shadow-[0_0_20px_rgba(212,175,55,0.6)]" />
              <p className="font-medium">{data.anomaliesSummary}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/30 border-white/5 rounded-3xl shadow-xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <ShieldCheck className="w-24 h-24 text-primary" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-white">Global Mitigation Roadmap</CardTitle>
              <CardDescription>Consolidated Multi-Agent Strategy for Leadership</CardDescription>
            </div>
            <ShieldCheck className="w-6 h-6 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.globalMitigationStrategies.map((strategy, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all hover:translate-x-1">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-[11px] font-black text-primary shrink-0 border border-primary/20">{idx + 1}</div>
                  <span className="text-xs text-muted-foreground leading-relaxed font-medium">{strategy}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
