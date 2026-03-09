"use client";

import * as React from "react";
import { queryRiskCopilot } from "@/ai/flows/query-risk-copilot";
import { initiateComprehensiveRiskAnalysis } from "@/ai/flows/initiate-comprehensive-risk-analysis";
import { mockOrganizationalData } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, User, Send, Loader2, Sparkles, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CopilotPage() {
  const [messages, setMessages] = React.useState<{ role: 'user' | 'assistant', content: string }[]>([
    { role: 'assistant', content: "Hello! I am your IntelliRisk Copilot. I have access to the full suite of AI agent analyses. How can I help you interpret our risk posture today?" }
  ]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [combinedOutputs, setCombinedOutputs] = React.useState("");

  React.useEffect(() => {
    async function loadData() {
      const data = await initiateComprehensiveRiskAnalysis(mockOrganizationalData);
      setCombinedOutputs(JSON.stringify(data));
    }
    loadData();
  }, []);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const response = await queryRiskCopilot({
        userQuery: userMessage,
        combinedAgentOutputs: combinedOutputs || "Analysis in progress..."
      });
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I encountered an error while processing your request." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-lg">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-headline">Risk Copilot</h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-primary" />
              Connected to all 5 Specialized Agents
            </p>
          </div>
        </div>
      </div>

      <Card className="flex-1 overflow-hidden shadow-xl border-primary/20 flex flex-col">
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            {messages.map((m, idx) => (
              <div key={idx} className={cn("flex gap-4", m.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                  m.role === 'user' ? "bg-muted" : "bg-primary text-white"
                )}>
                  {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={cn(
                  "max-w-[80%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed",
                  m.role === 'user' ? "bg-muted/50 rounded-tr-none" : "bg-white border rounded-tl-none"
                )}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border p-4 rounded-2xl rounded-tl-none shadow-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="p-4 border-t bg-muted/30">
          <div className="flex gap-2">
            <Input 
              placeholder="Ask about financial anomalies, cybersecurity threats, or global mitigation..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="bg-white"
            />
            <Button onClick={handleSend} disabled={loading} className="shrink-0 bg-primary">
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 text-center uppercase tracking-widest font-bold">
            IntelliRisk AI Intelligence Layer
          </p>
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {[
          "Explain the Financial risk index",
          "What are the top 3 critical risks?",
          "Summarize Cybersecurity anomalies",
          "Propose strategic mitigations"
        ].map((suggestion, idx) => (
          <Button 
            key={idx} 
            variant="outline" 
            className="text-[10px] h-auto py-2 px-3 text-left justify-start font-medium bg-white hover:bg-primary/5 border-primary/10"
            onClick={() => setInput(suggestion)}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
}
