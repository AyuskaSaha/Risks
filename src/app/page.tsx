
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
  CheckCircle2,
  BarChart3,
  PieChart,
  LineChart as LineChartIcon,
  Network,
  Calendar,
  Layers,
  Target,
  Info,
  History,
  Workflow,
  Zap,
  Split
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
  Cell,
  Line,
  LineChart,
  Area,
  AreaChart,
  Pie,
  PieChart as RechartsPieChart,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Scatter,
  ScatterChart,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList
} from "recharts";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockOrganizationalData } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const chartConfig = {
  score: { label: "Risk Score" },
  current: { label: "Current Risk", color: "hsl(var(--primary))" },
  forecast: { label: "AI Forecast", color: "hsl(var(--chart-2))" },
  financial: { label: "Financial", color: "hsl(var(--chart-1))" },
  cybersecurity: { label: "Cyber", color: "hsl(var(--chart-2))" },
  operational: { label: "Operational", color: "hsl(var(--chart-3))" },
  compliance: { label: "Compliance", color: "hsl(var(--chart-4))" },
  strategicMarket: { label: "Strategic", color: "hsl(var(--chart-5))" },
} satisfies ChartConfig;

export default function Dashboard() {
  const [analyzing, setAnalyzing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [data, setData] = React.useState<InitiateComprehensiveRiskAnalysisOutput | null>(null);
  const [showSetup, setShowSetup] = React.useState(true);
  const [retryTimer, setRetryTimer] = React.useState<number | null>(null);
  const [isSimulated, setIsSimulated] = React.useState(false);

  const [formData, setFormData] = React.useState<InitiateComprehensiveRiskAnalysisInput>({
    companyName: "Global Horizon Logistics",
    srsDocument: "",
    brdDocument: "",
    legalPolicyDocument: "",
    proposalDocument: "",
  });

  const handleFileUpload = (type: 'srs' | 'brd' | 'legal' | 'proposal') => {
    const fieldMapping = {
      srs: 'srsDocument',
      brd: 'brdDocument',
      legal: 'legalPolicyDocument',
      proposal: 'proposalDocument'
    } as const;
    const fieldName = fieldMapping[type];
    const mockContent = mockOrganizationalData[fieldName] as string;
    setFormData(prev => ({ ...prev, [fieldName]: mockContent }));
  };

  const handleLoadSample = () => {
    setFormData(mockOrganizationalData);
    setError(null);
  };

  const isUploaded = (type: 'srs' | 'brd' | 'legal' | 'proposal') => {
    const fieldMapping = {
      srs: 'srsDocument',
      brd: 'brdDocument',
      legal: 'legalPolicyDocument',
      proposal: 'proposalDocument'
    } as const;
    return !!formData[fieldMapping[type]];
  };

  const allFilesUploaded = !!(
    formData.srsDocument && 
    formData.brdDocument && 
    formData.legalPolicyDocument && 
    formData.proposalDocument &&
    formData.companyName
  );

  const handleStartAnalysis = async (simulated: boolean = false) => {
    if (!allFilesUploaded) {
      setError("Strategic baseline incomplete. Please upload all 4 required pillars.");
      return;
    }
    setAnalyzing(true);
    setError(null);
    setIsSimulated(simulated);

    if (simulated) {
      // Simulate a brief delay then use high-fidelity mock data for the dashboard
      setTimeout(() => {
        setData(generateSimulatedData());
        setShowSetup(false);
        setAnalyzing(false);
      }, 2000);
      return;
    }

    try {
      const result = await initiateComprehensiveRiskAnalysis(formData);
      setData(result);
      setShowSetup(false);
    } catch (e: any) {
      const isRateLimit = e.message?.includes('429') || e.message?.includes('RESOURCE_EXHAUSTED');
      if (isRateLimit) {
        setError("AI Engine quota reached (Rate Limit). System is cooling down. You can wait or run a simulated analysis based on local intelligence.");
        setRetryTimer(30);
      } else {
        setError(e.message || "Risk Agent Orchestration failed.");
      }
      setShowSetup(true);
    } finally {
      if (!simulated) setAnalyzing(false);
    }
  };

  const generateSimulatedData = (): InitiateComprehensiveRiskAnalysisOutput => {
    // High-fidelity fallback data that satisfies the 15-visual requirement
    return {
      overallRiskIndex: 68,
      overallRiskLevel: 'High',
      anomaliesSummary: "SYSTEM ALERT: Simulated analysis indicates cross-vector contradictions between 'Project Zephyr' proposal and FAA safety protocols in Legal pillars. Unusual $1.5M single-signature outflow detected in Finance.",
      globalMitigationStrategies: ["Enforce dual-officer sign-off", "Standardize drone flight simulations"],
      domainAnalysis: {
        financial: { risks: [], summary: "High risk due to liquidity gaps.", overallRiskScore: 72 },
        cybersecurity: { risks: [], summary: "Critical vulnerabilities in sorting API.", overallRiskScore: 85 },
        operational: { risks: [], summary: "Uptime targets missing due to legacy equipment.", overallRiskScore: 45 },
        compliance: { risks: [], summary: "Partial alignment with EU AI Act.", overallRiskScore: 30 },
        strategicMarket: { risks: [], summary: "Market volatility impacting expansion.", overallRiskScore: 55 },
      },
      heatmapData: [
        { impact: 5, probability: 4, count: 2, label: "Cyber" },
        { impact: 4, probability: 5, count: 1, label: "Financial" },
        { impact: 3, probability: 2, count: 5, label: "Operational" },
        { impact: 1, probability: 1, count: 10, label: "Low" }
      ],
      trendData: [
        { month: "JAN", current: 45, forecast: 42 },
        { month: "FEB", current: 48, forecast: 45 },
        { month: "MAR", current: 55, forecast: 50 },
        { month: "APR", current: 62, forecast: 58 },
        { month: "MAY", current: 68, forecast: 65 },
        { month: "JUN", current: 72, forecast: 60 }
      ],
      severityDistribution: [
        { category: "Finance", Critical: 2, High: 4, Medium: 3, Low: 1 },
        { category: "Cyber", Critical: 5, High: 2, Medium: 8, Low: 4 },
        { category: "Ops", Critical: 1, High: 3, Medium: 12, Low: 15 },
        { category: "Legal", Critical: 0, High: 1, Medium: 5, Low: 20 }
      ],
      mitigationProgress: [
        { name: "MFA Enforced", progress: 92 },
        { name: "dual-Sign Policy", progress: 45 },
        { name: "System Patching", progress: 78 }
      ],
      deptComparison: [
        { subject: "Finance", A: 85, B: 90, fullMark: 100 },
        { subject: "Tech", A: 45, B: 85, fullMark: 100 },
        { subject: "Sales", A: 90, B: 95, fullMark: 100 },
        { subject: "Legal", A: 60, B: 80, fullMark: 100 },
        { subject: "Ops", A: 55, B: 75, fullMark: 100 }
      ],
      incidentFrequency: [
        { day: "01/10", count: 2 }, { day: "02/10", count: 5 }, { day: "03/10", count: 1 }, { day: "04/10", count: 8 },
        { day: "05/10", count: 3 }, { day: "06/10", count: 12 }, { day: "07/10", count: 4 }
      ],
      gapAnalysis: { current: 45, desired: 95, gap: 50 },
      riskTimeline: [
        { time: "08:00", event: "Financial Audit", type: "Review" },
        { time: "12:00", event: "Cyber Threat Det.", type: "Critical" },
        { time: "15:00", event: "Policy Alignment", type: "Legal" }
      ],
      riskReduction: [
        { name: "Auth", before: 80, after: 20 },
        { name: "Liquidity", before: 60, after: 35 },
        { name: "Latency", before: 40, after: 15 }
      ]
    };
  };

  React.useEffect(() => {
    if (retryTimer !== null && retryTimer > 0) {
      const timer = setTimeout(() => setRetryTimer(retryTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [retryTimer]);

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
          <h2 className="text-3xl font-bold text-white font-headline tracking-tight">
            {isSimulated ? "Initializing Simulated Core" : "Synchronizing Agents"}
          </h2>
          <div className="flex items-center justify-center gap-4">
            {['Financial', 'Cyber', 'Operational', 'Compliance', 'Strategic'].map((a, i) => (
              <div key={a} className="flex flex-col items-center gap-2" style={{ animationDelay: `${i * 150}ms` }}>
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">{a}</span>
              </div>
            ))}
          </div>
          <p className="text-muted-foreground text-sm">
            {isSimulated ? "Generating high-fidelity strategic telemetry..." : `Correlating strategic pillars for ${formData.companyName}...`}
          </p>
        </div>
      </div>
    );
  }

  if (showSetup) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-top-4 duration-1000 pb-20">
        <div className="text-center space-y-4">
          <Badge variant="outline" className="border-primary/40 text-primary px-4 py-1 rounded-full text-[10px] tracking-widest uppercase font-bold">
            IntelliRisk Command Center
          </Badge>
          <h1 className="text-6xl font-extrabold tracking-tighter text-white font-headline">Intelligence Setup</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Upload organizational pillars to initialize vector correlation.
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>System Alert</AlertTitle>
            <AlertDescription className="flex flex-col gap-4 mt-2">
              <p>{error}</p>
              {error.includes("Rate limit") && (
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-destructive/30 hover:bg-destructive/20 text-xs font-bold"
                    onClick={() => handleStartAnalysis(true)}
                  >
                    RUN SIMULATED ANALYSIS
                  </Button>
                  {retryTimer !== null && retryTimer > 0 && (
                    <Badge variant="outline" className="border-destructive text-destructive animate-pulse">
                      Retry in {retryTimer}s
                    </Badge>
                  )}
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        <Card className="bg-card/50 border-primary/20 shadow-2xl overflow-hidden backdrop-blur-md">
          <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
          <CardHeader className="pb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl flex items-center gap-2 text-white">
                  <UploadCloud className="w-5 h-5 text-primary" />
                  Strategic Ingestion Portal
                </CardTitle>
                <CardDescription>Required documents for deep correlation analysis.</CardDescription>
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
                  className="bg-white/5 border-white/10 text-white h-14 text-xl focus:border-primary/50 transition-all rounded-xl"
                  placeholder="Enter Organization Name..."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(['srs', 'brd', 'legal', 'proposal'] as const).map((id) => (
                  <div key={id} onClick={() => handleFileUpload(id)} className={cn(
                    "flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed transition-all h-[140px] cursor-pointer",
                    isUploaded(id) ? "bg-primary/5 border-primary/40" : "bg-white/5 border-white/5 hover:border-white/20"
                  )}>
                    {isUploaded(id) ? (
                      <CheckCircle2 className="w-8 h-8 text-primary" />
                    ) : (
                      <FileText className="w-8 h-8 opacity-40" />
                    )}
                    <span className="text-xs mt-2 uppercase font-bold tracking-tighter">{id.toUpperCase()} Pillar</span>
                  </div>
                ))}
              </div>
            </div>
            <Button 
              onClick={() => handleStartAnalysis(false)} 
              disabled={!allFilesUploaded || (retryTimer !== null && retryTimer > 0)} 
              className="w-full h-16 bg-primary hover:bg-primary/90 text-black font-black text-xl gap-3 rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.2)]"
            >
              INITIALIZE MULTI-AGENT ORCHESTRATION
              <ChevronRight className="w-7 h-7" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <Badge className="bg-primary/20 text-primary border-primary/20 text-[10px] font-black tracking-widest uppercase">
            {isSimulated ? "Simulated Baseline Active" : "Live Orchestration Active"}
          </Badge>
          <h1 className="text-5xl font-black tracking-tight text-white font-headline">Threat Command</h1>
          <p className="text-muted-foreground">Strategic Risk Engine for <span className="text-white font-bold">{formData.companyName}</span></p>
        </div>
        <div className="flex gap-2">
          <Link href="/copilot">
            <Button className="gap-2 bg-primary hover:bg-primary/90 text-black h-12 rounded-xl shadow-lg shadow-primary/20">
              <ShieldAlert className="w-5 h-5" />
              Risk Copilot
            </Button>
          </Link>
          <Button onClick={() => setShowSetup(true)} variant="outline" className="gap-2 bg-white/5 hover:bg-white/10 border-white/10 text-white h-12 rounded-xl">
            <ListRestart className="w-5 h-5" />
            Recalibrate
          </Button>
        </div>
      </div>

      <Card className="bg-primary/5 border-primary/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
        <CardHeader className="flex flex-row items-center gap-4 py-4">
          <Activity className="w-6 h-6 text-primary" />
          <div>
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary">Intelligence Summary</CardTitle>
            <CardDescription className="text-foreground/80 italic text-base leading-relaxed mt-1">
              {data.anomaliesSummary}
            </CardDescription>
          </div>
        </CardHeader>
      </Card>

      {/* Grid Layout for 15 Visuals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        
        {/* 1. Aggregate Risk Index (Gauge) */}
        <Card className="lg:col-span-1 xl:col-span-2 bg-card/50 border-primary/20 flex flex-col items-center justify-center py-6">
          <CardHeader className="w-full text-center">
            <CardTitle className="text-lg">Aggregate Risk Index</CardTitle>
            <CardDescription className="text-[10px]">Combined Agent Scoring</CardDescription>
          </CardHeader>
          <RiskGauge score={data.overallRiskIndex} level={data.overallRiskLevel} />
        </Card>

        {/* 2. Risk Heatmap Matrix */}
        <Card className="lg:col-span-1 xl:col-span-2 bg-card/50 border-white/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-white"><Layers className="w-5 h-5 text-primary" /> Risk Heatmap & Matrix</CardTitle>
            <CardDescription className="text-[10px]">Impact vs Probability (5x5 Grid)</CardDescription>
          </CardHeader>
          <CardContent className="h-[220px]">
             <ChartContainer config={chartConfig} className="h-full w-full">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis type="number" dataKey="probability" name="Probability" domain={[0, 5]} unit="/5" tick={{fill: 'white', fontSize: 10}} />
                  <YAxis type="number" dataKey="impact" name="Impact" domain={[0, 5]} unit="/5" tick={{fill: 'white', fontSize: 10}} />
                  <ZAxis type="number" dataKey="count" range={[100, 1000]} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<ChartTooltipContent />} />
                  <Scatter data={data.heatmapData} fill="hsl(var(--primary))">
                    {data.heatmapData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.impact > 3 ? "hsl(var(--destructive))" : "hsl(var(--primary))"} />
                    ))}
                  </Scatter>
                </ScatterChart>
             </ChartContainer>
          </CardContent>
        </Card>

        {/* 3. Dept Comparison Radar */}
        <Card className="lg:col-span-1 xl:col-span-2 bg-card/50 border-white/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-white"><Target className="w-5 h-5 text-primary" /> Dept Exposure Radar</CardTitle>
            <CardDescription className="text-[10px]">Multi-departmental Risk Surface</CardDescription>
          </CardHeader>
          <CardContent className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={data.deptComparison}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }} />
                <Radar name="Current" dataKey="A" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                <Radar name="Benchmark" dataKey="B" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.2} />
                <Tooltip contentStyle={{ backgroundColor: '#000', border: 'none' }} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 4. Trend Analysis & AI Forecast */}
        <Card className="md:col-span-2 lg:col-span-4 bg-card/50 border-white/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-white"><LineChartIcon className="w-5 h-5 text-primary" /> Trend Analysis & Forecast</CardTitle>
            <CardDescription className="text-[10px]">Historical Tracking + 3 Month AI Prediction</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <AreaChart data={data.trendData}>
                <defs>
                  <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: 'white', fontSize: 10}} />
                <YAxis domain={[0, 100]} hide />
                <Tooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="current" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorCurrent)" strokeWidth={3} />
                <Line type="monotone" dataKey="forecast" stroke="hsl(var(--chart-2))" strokeDasharray="5 5" strokeWidth={2} dot={false} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* 5. Severity Distribution */}
        <Card className="md:col-span-2 lg:col-span-2 bg-card/50 border-white/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-white"><BarChart3 className="w-5 h-5 text-primary" /> Severity Distribution</CardTitle>
            <CardDescription className="text-[10px]">Calculated Stack per Domain</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <BarChart data={data.severityDistribution} layout="vertical" margin={{left: 20}}>
                <XAxis type="number" hide />
                <YAxis dataKey="category" type="category" axisLine={false} tickLine={false} tick={{ fill: "white", fontSize: 10 }} width={80} />
                <Bar dataKey="Critical" stackId="a" fill="hsl(var(--destructive))" />
                <Bar dataKey="High" stackId="a" fill="hsl(var(--chart-4))" />
                <Bar dataKey="Medium" stackId="a" fill="hsl(var(--chart-1))" />
                <Bar dataKey="Low" stackId="a" fill="hsl(var(--chart-3))" radius={[0, 4, 4, 0]} />
                <ChartTooltip content={<ChartTooltipContent />} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* 6. Mitigation Progress Tracker */}
        <Card className="md:col-span-2 lg:col-span-3 bg-card/50 border-white/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-white"><ShieldCheck className="w-5 h-5 text-primary" /> Mitigation Progress</CardTitle>
            <CardDescription className="text-[10px]">Active Strategic Countermeasures</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {data.mitigationProgress.map((p, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-white">{p.name}</span>
                  <span className="text-primary font-mono">{p.progress}%</span>
                </div>
                <Progress value={p.progress} className="h-1.5" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 7. Gap Analysis & 8. Risk Category Breakdown (Donut) */}
        <Card className="md:col-span-2 lg:col-span-3 bg-card/50 border-white/5 flex flex-col md:flex-row p-6 gap-6">
          <div className="flex-1 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2"><Workflow className="w-4 h-4" /> Gap Analysis</h3>
            <div className="relative pt-10 flex flex-col items-center">
              <div className="w-0 h-0 border-l-[60px] border-l-transparent border-r-[60px] border-r-transparent border-b-[100px] border-b-primary opacity-20 absolute" />
              <div className="relative z-10 text-center">
                <div className="text-4xl font-black text-white">{data.gapAnalysis.gap}%</div>
                <div className="text-[10px] text-primary uppercase font-bold">Strategic Gap</div>
              </div>
              <div className="grid grid-cols-2 gap-8 w-full mt-12 text-center text-[10px] uppercase font-bold">
                <div><div className="text-muted-foreground">Current</div><div className="text-white text-lg">{data.gapAnalysis.current}%</div></div>
                <div><div className="text-muted-foreground">Target</div><div className="text-white text-lg">{data.gapAnalysis.desired}%</div></div>
              </div>
            </div>
          </div>
          <div className="w-px bg-white/5 hidden md:block" />
          <div className="flex-1 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2"><PieChart className="w-4 h-4" /> Category Breakdown</h3>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie data={Object.entries(data.domainAnalysis).map(([k, v]) => ({ name: k, value: v.overallRiskScore }))} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {[0,1,2,3,4].map((i) => <Cell key={i} fill={`hsl(var(--chart-${i+1}))`} />)}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        {/* 9. Intelligence Timeline */}
        <Card className="md:col-span-2 lg:col-span-6 bg-card/50 border-white/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-white"><Calendar className="w-5 h-5 text-primary" /> Intelligence Timeline</CardTitle>
            <CardDescription className="text-[10px]">Detection & Review Cycles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-start overflow-x-auto gap-12 pb-4 scrollbar-hide">
              {data.riskTimeline.map((item, i) => (
                <div key={i} className="flex flex-col items-center min-w-[140px] relative text-center">
                  <div className="w-4 h-4 rounded-full bg-primary mb-3 shadow-[0_0_15px_rgba(212,175,55,1)] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-black" />
                  </div>
                  <div className="text-[10px] text-muted-foreground mb-1 font-mono">{item.time}</div>
                  <div className="text-[11px] font-bold text-white mb-2">{item.event}</div>
                  <Badge variant="outline" className="text-[8px] uppercase tracking-tighter opacity-70 border-primary/20 text-primary">{item.type}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 10. Incident Frequency Area Graph */}
        <Card className="md:col-span-2 lg:col-span-3 bg-card/50 border-white/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-white"><Activity className="w-5 h-5 text-primary" /> Incident Frequency</CardTitle>
            <CardDescription className="text-[10px]">Events per 24h Period</CardDescription>
          </CardHeader>
          <CardContent className="h-[220px]">
             <ChartContainer config={chartConfig} className="h-full w-full">
                <AreaChart data={data.incidentFrequency}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: 'white', fontSize: 9}} />
                  <YAxis hide />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Area type="stepAfter" dataKey="count" stroke="hsl(var(--chart-4))" fill="hsl(var(--chart-4))" fillOpacity={0.1} />
                </AreaChart>
             </ChartContainer>
          </CardContent>
        </Card>

        {/* 11. Dependency Network (Visual representation) */}
        <Card className="md:col-span-2 lg:col-span-3 bg-card/50 border-white/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-white"><Network className="w-5 h-5 text-primary" /> Dependency Network</CardTitle>
            <CardDescription className="text-[10px]">Cross-Vector Interconnectivity</CardDescription>
          </CardHeader>
          <CardContent className="h-[220px] relative">
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <Network className="w-40 h-40" />
            </div>
            <div className="grid grid-cols-3 gap-2 relative z-10 h-full">
              {['Cyber', 'Financial', 'Ops', 'Legal', 'Strategic', 'Market'].map((d, i) => (
                <div key={d} className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-center items-center group hover:bg-primary/10 hover:border-primary/50 cursor-pointer transition-all">
                  <div className="w-2 h-2 rounded-full bg-primary mb-2 group-hover:animate-ping" />
                  <span className="text-[10px] font-bold text-white uppercase">{d}</span>
                  <span className="text-[8px] text-muted-foreground mt-1">4 Interlinks</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 12. Risk Reduction (Before vs After) */}
        <Card className="md:col-span-2 lg:col-span-3 bg-card/50 border-white/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-white"><History className="w-5 h-5 text-primary" /> Risk Reduction Delta</CardTitle>
            <CardDescription className="text-[10px]">Mitigation Impact Verification</CardDescription>
          </CardHeader>
          <CardContent className="h-[220px]">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <BarChart data={data.riskReduction}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{fill: 'white', fontSize: 9}} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="before" fill="rgba(255,255,255,0.1)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="after" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* 13. Root Cause Analysis (Fishbone concept) */}
        <Card className="md:col-span-2 lg:col-span-3 bg-card/50 border-white/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-white"><Split className="w-5 h-5 text-primary" /> Root Cause Analysis</CardTitle>
            <CardDescription className="text-[10px]">Primary Vectors of Systemic Risk</CardDescription>
          </CardHeader>
          <CardContent className="h-[220px]">
            <div className="space-y-4">
              {[
                { label: "Human Factor", val: 82, color: "bg-red-500" },
                { label: "Technical Debt", val: 65, color: "bg-orange-500" },
                { label: "Regulatory Gap", val: 40, color: "bg-primary" },
                { label: "Market Shift", val: 15, color: "bg-green-500" }
              ].map((r, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="text-[9px] font-bold text-white w-20 uppercase tracking-tighter">{r.label}</span>
                  <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                    <div className={cn("h-full", r.color)} style={{ width: `${r.val}%` }} />
                  </div>
                  <span className="text-[10px] font-mono text-primary w-8">{r.val}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Agents Section */}
      <div className="space-y-6 pt-8">
        <h2 className="text-3xl font-black text-white flex items-center gap-3">
          <Cpu className="w-8 h-8 text-primary" /> Specialized Intelligence Layer
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {Object.entries(data.domainAnalysis).map(([key, analysis]) => (
            <Card key={key} className="bg-card/40 border-white/5 hover:border-primary/40 transition-all group rounded-2xl cursor-pointer">
              <div className="h-1.5 w-full bg-primary transition-all group-hover:h-3" />
              <CardHeader className="p-5 pb-3">
                <div className="flex items-center justify-between mb-2">
                   <Badge variant="outline" className="text-primary border-primary/20 font-mono text-[10px]">{analysis.overallRiskScore}%</Badge>
                   <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
                </div>
                <CardTitle className="text-base font-bold text-white capitalize">{key}</CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0">
                <p className="text-[11px] leading-relaxed text-muted-foreground italic mb-4 line-clamp-3">"{analysis.summary}"</p>
                <div className="flex flex-col gap-2 pt-4 border-t border-white/5">
                  <Link href={`/agents/${key}`} className="text-[9px] text-primary font-black uppercase tracking-wider flex items-center justify-between hover:translate-x-1 transition-transform">Cognitive Logs <ArrowRight className="w-3 h-3" /></Link>
                  <Link href={`/risk/${key}`} className="text-[9px] text-muted-foreground font-black uppercase tracking-wider flex items-center justify-between hover:translate-x-1 transition-transform">Risk Details <ArrowRight className="w-3 h-3" /></Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
