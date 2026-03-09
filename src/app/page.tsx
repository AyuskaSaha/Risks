
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
  Split,
  ScatterChart as BubbleIcon
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
  CartesianGrid
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
    setFormData(prev => ({ ...prev, [fieldName]: mockOrganizationalData[fieldName] }));
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
        setError("AI Engine quota reached (Rate Limit). System is cooling down. You can wait or run a simulated analysis.");
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
    return {
      overallRiskIndex: 74,
      overallRiskLevel: 'High',
      anomaliesSummary: "CRITICAL ALERT: Detected cross-vector contradiction between Project 'Zephyr' and FAA safety protocols. Financial pillar shows a $1.5M single-signature outflow deviation.",
      globalMitigationStrategies: ["Mandate dual-officer sign-off for pre-payments", "Re-validate neural network optimization via standard simulation"],
      domainAnalysis: {
        financial: { risks: [], summary: "High risk due to non-compliant pre-payments.", overallRiskScore: 78 },
        cybersecurity: { risks: [], summary: "Sorting API exposed to unauthorized access.", overallRiskScore: 82 },
        operational: { risks: [], summary: "Supply chain latency exceeding baseline.", overallRiskScore: 65 },
        compliance: { risks: [], summary: "Strategic misalignment with EU AI Act.", overallRiskScore: 45 },
        strategicMarket: { risks: [], summary: "Competitor positioning driving risky rollouts.", overallRiskScore: 70 },
      },
      heatmapData: [
        { impact: 5, probability: 4, count: 2, label: "Cyber" },
        { impact: 4, probability: 5, count: 1, label: "Finance" },
        { impact: 3, probability: 3, count: 5, label: "Ops" },
        { impact: 2, probability: 1, count: 8, label: "Low" }
      ],
      trendData: [
        { month: "JAN", current: 40, forecast: 38 },
        { month: "FEB", current: 45, forecast: 42 },
        { month: "MAR", current: 55, forecast: 50 },
        { month: "APR", current: 65, forecast: 62 },
        { month: "MAY", current: 74, forecast: 70 },
        { month: "JUN", current: 80, forecast: 65 }
      ],
      severityDistribution: [
        { category: "Finance", Critical: 2, High: 4, Medium: 2, Low: 1 },
        { category: "Cyber", Critical: 5, High: 3, Medium: 7, Low: 2 },
        { category: "Ops", Critical: 1, High: 2, Medium: 10, Low: 12 },
        { category: "Compliance", Critical: 3, High: 1, Medium: 5, Low: 15 }
      ],
      mitigationProgress: [
        { name: "MFA Enforcement", progress: 92 },
        { name: "Dual-Sign Policy", progress: 45 },
        { name: "Audit Trail Ingestion", progress: 78 }
      ],
      deptComparison: [
        { subject: "Finance", A: 85, B: 90, fullMark: 100 },
        { subject: "Tech", A: 65, B: 85, fullMark: 100 },
        { subject: "Legal", A: 45, B: 80, fullMark: 100 },
        { subject: "Sales", A: 95, B: 95, fullMark: 100 },
        { subject: "Ops", A: 70, B: 85, fullMark: 100 }
      ],
      incidentFrequency: [
        { day: "01/10", count: 2 }, { day: "02/10", count: 5 }, { day: "03/10", count: 1 }, { day: "04/10", count: 8 },
        { day: "05/10", count: 4 }, { day: "06/10", count: 12 }, { day: "07/10", count: 6 }
      ],
      gapAnalysis: { current: 52, desired: 95, gap: 43 },
      riskTimeline: [
        { time: "08:00", event: "Financial Sweep", type: "Review" },
        { time: "11:30", event: "API Breach Att.", type: "Critical" },
        { time: "15:00", event: "Pillar Correlation", type: "System" }
      ],
      riskReduction: [
        { name: "Auth", before: 85, after: 15 },
        { name: "Liquidity", before: 60, after: 40 },
        { name: "Simulation", before: 90, after: 20 }
      ],
      bubbleData: [
        { x: 5, y: 4, z: 80, name: "Data Breach" },
        { x: 3, y: 2, z: 40, name: "Equipment" },
        { x: 4, y: 5, z: 95, name: "Compliance" }
      ],
      rootCauseData: [
        { factor: "Human Error", percentage: 42, color: "bg-red-500" },
        { factor: "Tech Debt", percentage: 35, color: "bg-orange-500" },
        { factor: "Policy Gap", percentage: 23, color: "bg-primary" }
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
      <div className="flex flex-col items-center justify-center h-[80vh] space-y-8">
        <div className="relative">
          <div className="w-40 h-40 rounded-full border-2 border-primary/10 border-t-primary animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Cpu className="w-12 h-12 text-primary animate-pulse" />
          </div>
        </div>
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-white font-headline">Synchronizing Agents</h2>
          <p className="text-muted-foreground max-w-sm mx-auto">
            {isSimulated ? "Initializing high-fidelity strategic telemetry..." : `Correlating strategic pillars for ${formData.companyName}...`}
          </p>
        </div>
      </div>
    );
  }

  if (showSetup) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-20">
        <div className="text-center space-y-4">
          <Badge variant="outline" className="border-primary/40 text-primary">IntelliRisk Command Center</Badge>
          <h1 className="text-6xl font-black tracking-tighter text-white font-headline">Intelligence Setup</h1>
          <p className="text-muted-foreground text-lg">Initialize vector correlation by uploading core organizational pillars.</p>
        </div>

        {error && (
          <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>System Alert</AlertTitle>
            <AlertDescription className="mt-2 space-y-4">
              <p>{error}</p>
              <div className="flex gap-3">
                <Button variant="outline" size="sm" className="border-destructive/30 hover:bg-destructive/20" onClick={() => handleStartAnalysis(true)}>
                  RUN SIMULATED ANALYSIS
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <Card className="bg-card/50 border-primary/20 shadow-2xl overflow-hidden backdrop-blur-md">
          <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-2 text-white"><UploadCloud className="w-5 h-5 text-primary" /> Strategic Ingestion</CardTitle>
                <CardDescription>Upload core PDF documents for deep correlation.</CardDescription>
              </div>
              <Button onClick={handleLoadSample} variant="outline" size="sm" className="text-[10px] font-bold border-primary/20">LOAD SAMPLE PACK</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-8 pt-0">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest pl-1">Target Organization</Label>
              <Input value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} className="bg-white/5 border-white/10 text-white h-12 text-lg focus:border-primary/50 transition-all" placeholder="Enter Organization Name..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {(['srs', 'brd', 'legal', 'proposal'] as const).map((id) => (
                <div key={id} onClick={() => handleFileUpload(id)} className={cn(
                  "flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed transition-all h-[120px] cursor-pointer",
                  isUploaded(id) ? "bg-primary/5 border-primary/40" : "bg-white/5 border-white/5 hover:border-white/20"
                )}>
                  {isUploaded(id) ? <CheckCircle2 className="w-8 h-8 text-primary" /> : <FileText className="w-8 h-8 opacity-40" />}
                  <span className="text-[10px] mt-2 uppercase font-black tracking-widest">{id} PILLAR</span>
                </div>
              ))}
            </div>
            <Button onClick={() => handleStartAnalysis(false)} disabled={!allFilesUploaded} className="w-full h-16 bg-primary hover:bg-primary/90 text-black font-black text-xl gap-3 rounded-2xl">
              INITIALIZE MULTI-AGENT ORCHESTRATION <ChevronRight className="w-7 h-7" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20 max-w-[1600px] mx-auto">
      {/* 1. Header & Quick Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <Badge className="bg-primary/20 text-primary border-primary/20 mb-2 uppercase tracking-widest font-black text-[10px]">
            {isSimulated ? "Simulated Baseline Active" : "Live Orchestration Active"}
          </Badge>
          <h1 className="text-5xl font-black tracking-tighter text-white font-headline">Threat Command</h1>
          <p className="text-muted-foreground">Strategic Analysis for <span className="text-white font-bold">{formData.companyName}</span></p>
        </div>
        <div className="flex gap-2">
          <Link href="/copilot"><Button className="gap-2 bg-primary hover:bg-primary/90 text-black h-12 rounded-xl"><ShieldAlert className="w-5 h-5" /> Risk Copilot</Button></Link>
          <Button onClick={() => setShowSetup(true)} variant="outline" className="gap-2 h-12 rounded-xl border-white/10"><ListRestart className="w-5 h-5" /> Recalibrate</Button>
        </div>
      </div>

      {/* 2. Anomalies Alert Bar */}
      <Card className="bg-primary/5 border-primary/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
        <CardHeader className="py-4">
          <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
            <Activity className="w-4 h-4" /> Intelligence Summary
          </CardTitle>
          <p className="text-foreground/80 italic text-base leading-relaxed mt-2">{data.anomaliesSummary}</p>
        </CardHeader>
      </Card>

      {/* Grid of 15 Visuals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        
        {/* 1. Risk Gauge */}
        <Card className="lg:col-span-1 xl:col-span-2 bg-card/50 border-primary/20 flex flex-col items-center justify-center py-6">
          <CardHeader className="text-center w-full">
            <CardTitle className="text-lg">Aggregate Risk Index</CardTitle>
            <CardDescription className="text-[10px]">Composite scoring across 5 domains</CardDescription>
          </CardHeader>
          <RiskGauge score={data.overallRiskIndex} level={data.overallRiskLevel} />
        </Card>

        {/* 2. 5x5 Matrix (Heatmap) */}
        <Card className="lg:col-span-1 xl:col-span-2 bg-card/50 border-white/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-white"><Layers className="w-5 h-5 text-primary" /> Risk Matrix (5x5)</CardTitle>
            <CardDescription className="text-[10px]">Impact vs Likelihood Distribution</CardDescription>
          </CardHeader>
          <CardContent className="h-[220px]">
             <ChartContainer config={chartConfig} className="h-full w-full">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis type="number" dataKey="probability" name="Probability" domain={[1, 5]} unit="/5" tick={{fill: 'white', fontSize: 10}} />
                  <YAxis type="number" dataKey="impact" name="Impact" domain={[1, 5]} unit="/5" tick={{fill: 'white', fontSize: 10}} />
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

        {/* 3. Radar Comparison */}
        <Card className="lg:col-span-1 xl:col-span-2 bg-card/50 border-white/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-white"><Target className="w-5 h-5 text-primary" /> Dept Exposure Radar</CardTitle>
            <CardDescription className="text-[10px]">Risk Surface by Department</CardDescription>
          </CardHeader>
          <CardContent className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={data.deptComparison}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }} />
                <Radar name="Current" dataKey="A" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                <Radar name="Benchmark" dataKey="B" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 4. Trend Forecast */}
        <Card className="md:col-span-2 lg:col-span-4 bg-card/50 border-white/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-white"><LineChartIcon className="w-5 h-5 text-primary" /> Risk Trend Forecast</CardTitle>
            <CardDescription className="text-[10px]">Predictive Analysis for Q3/Q4</CardDescription>
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
                <YAxis hide />
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
            <CardDescription className="text-[10px]">Domain Specific Stacks</CardDescription>
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

        {/* 6. Gap Analysis Triangle */}
        <Card className="md:col-span-2 lg:col-span-3 bg-card/50 border-white/5 p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2 mb-6"><Workflow className="w-4 h-4" /> Gap Analysis Triangle</h3>
          <div className="relative flex flex-col items-center h-[200px] justify-center">
            <div className="w-0 h-0 border-l-[80px] border-l-transparent border-r-[80px] border-r-transparent border-b-[140px] border-b-primary opacity-20 absolute" />
            <div className="relative z-10 text-center">
              <div className="text-5xl font-black text-white">{data.gapAnalysis.gap}%</div>
              <div className="text-[10px] text-primary uppercase font-black tracking-widest mt-2">Strategic Gap</div>
            </div>
            <div className="flex justify-between w-full mt-auto text-center px-4">
              <div><div className="text-[10px] text-muted-foreground uppercase">Current</div><div className="text-lg font-bold text-white">{data.gapAnalysis.current}%</div></div>
              <div><div className="text-[10px] text-muted-foreground uppercase">Target</div><div className="text-lg font-bold text-white">{data.gapAnalysis.desired}%</div></div>
            </div>
          </div>
        </Card>

        {/* 7. Category Breakdown (Donut) */}
        <Card className="md:col-span-2 lg:col-span-3 bg-card/50 border-white/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-white"><PieChart className="w-5 h-5 text-primary" /> Category Breakdown</CardTitle>
            <CardDescription className="text-[10px]">Risk Weighted Contribution</CardDescription>
          </CardHeader>
          <CardContent className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie data={Object.entries(data.domainAnalysis).map(([k, v]) => ({ name: k, value: v.overallRiskScore }))} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {[0,1,2,3,4].map((i) => <Cell key={i} fill={`hsl(var(--chart-${i+1}))`} />)}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 8. Incident Frequency */}
        <Card className="md:col-span-2 lg:col-span-3 bg-card/50 border-white/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-white"><Activity className="w-5 h-5 text-primary" /> Incident Frequency</CardTitle>
            <CardDescription className="text-[10px]">Active Events Tracking</CardDescription>
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

        {/* 9. Bubble Chart (Impact vs Likelihood) */}
        <Card className="md:col-span-2 lg:col-span-3 bg-card/50 border-white/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-white"><BubbleIcon className="w-5 h-5 text-primary" /> Impact vs Likelihood</CardTitle>
            <CardDescription className="text-[10px]">Bubble size = severity</CardDescription>
          </CardHeader>
          <CardContent className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" dataKey="x" name="Impact" domain={[1, 5]} unit="/5" tick={{fill: 'white', fontSize: 10}} />
                <YAxis type="number" dataKey="y" name="Likelihood" domain={[1, 5]} unit="/5" tick={{fill: 'white', fontSize: 10}} />
                <ZAxis type="number" dataKey="z" range={[500, 2000]} name="Severity" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Risks" data={data.bubbleData} fill="hsl(var(--primary))" />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 10. Risk Timeline */}
        <Card className="md:col-span-2 lg:col-span-6 bg-card/50 border-white/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-white"><Calendar className="w-5 h-5 text-primary" /> Intelligence Timeline</CardTitle>
            <CardDescription className="text-[10px]">Detection Log History</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center overflow-x-auto gap-12 pb-4 scrollbar-hide">
              {data.riskTimeline.map((item, i) => (
                <div key={i} className="flex flex-col items-center min-w-[150px] text-center">
                  <div className="w-4 h-4 rounded-full bg-primary mb-3 shadow-[0_0_15px_hsl(var(--primary))] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-black" />
                  </div>
                  <div className="text-[10px] text-muted-foreground mb-1 font-mono uppercase">{item.time}</div>
                  <div className="text-xs font-bold text-white mb-2">{item.event}</div>
                  <Badge variant="outline" className="text-[8px] uppercase border-primary/20 text-primary">{item.type}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 11. Root Cause Diagram */}
        <Card className="md:col-span-2 lg:col-span-3 bg-card/50 border-white/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-white"><Split className="w-5 h-5 text-primary" /> Root Cause Analysis</CardTitle>
            <CardDescription className="text-[10px]">Primary Systemic Vectors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 h-[220px] flex flex-col justify-center">
            {data.rootCauseData.map((r, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white">
                  <span>{r.factor}</span>
                  <span>{r.percentage}%</span>
                </div>
                <Progress value={r.percentage} className={cn("h-2", r.color)} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 12. Risk Reduction Delta */}
        <Card className="md:col-span-2 lg:col-span-3 bg-card/50 border-white/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-white"><History className="w-5 h-5 text-primary" /> Risk Reduction Delta</CardTitle>
            <CardDescription className="text-[10px]">Before vs After Mitigation</CardDescription>
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

        {/* 13. Mitigation Progress */}
        <Card className="md:col-span-2 lg:col-span-3 bg-card/50 border-white/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-white"><ShieldCheck className="w-5 h-5 text-primary" /> Mitigation Roadmap</CardTitle>
            <CardDescription className="text-[10px]">Execution Progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {data.mitigationProgress.map((p, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-[10px] font-black text-white uppercase">
                  <span>{p.name}</span>
                  <span className="text-primary">{p.progress}%</span>
                </div>
                <Progress value={p.progress} className="h-1.5" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 14. Dependency Network Visualization */}
        <Card className="md:col-span-2 lg:col-span-3 bg-card/50 border-white/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-white"><Network className="w-5 h-5 text-primary" /> Dependency Network</CardTitle>
            <CardDescription className="text-[10px]">Cross-Vector Interlinks</CardDescription>
          </CardHeader>
          <CardContent className="h-[220px] flex items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 flex items-center justify-center opacity-10"><Network className="w-40 h-40" /></div>
             <div className="grid grid-cols-3 gap-2 relative z-10 w-full">
               {['Cyber', 'Finance', 'Ops', 'Legal', 'Sales', 'Strategy'].map(d => (
                 <div key={d} className="p-3 bg-white/5 border border-white/10 rounded-xl text-center group hover:bg-primary/10 transition-all cursor-crosshair">
                   <Zap className="w-4 h-4 text-primary mx-auto mb-1 group-hover:scale-110" />
                   <span className="text-[8px] font-black uppercase text-white">{d}</span>
                 </div>
               ))}
             </div>
          </CardContent>
        </Card>

      </div>

      {/* Agents Section */}
      <div className="space-y-6 pt-8">
        <h2 className="text-3xl font-black text-white flex items-center gap-3"><Cpu className="w-8 h-8 text-primary" /> Intelligence Layer</h2>
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
