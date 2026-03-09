'use server';
/**
 * @fileOverview This file implements the Genkit flow for initiating a comprehensive organizational risk analysis.
 * It orchestrates five specialized AI agents (Financial, Cybersecurity, Operational, Compliance, Strategic/Market)
 * to analyze organizational data in parallel, then aggregates their structured JSON outputs using LLM reasoning
 * to identify anomalies, predict probabilities, and propose mitigation strategies across all risk domains.
 *
 * - initiateComprehensiveRiskAnalysis - The main function to trigger the comprehensive risk analysis.
 * - InitiateComprehensiveRiskAnalysisInput - The input type for the analysis, containing mock organizational data.
 * - InitiateComprehensiveRiskAnalysisOutput - The output type, representing the aggregated risk analysis.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// --- Schemas ---

const AgentOutputSchema = z.object({
  risks: z.array(z.object({
    name: z.string().describe('Name of the identified risk.'),
    description: z.string().describe('Detailed description of the risk, including specific anomalies detected.'),
    probability: z.enum(['Low', 'Medium', 'High']).describe('Predicted probability of the risk occurring.'),
    impact: z.enum(['Low', 'Medium', 'High', 'Critical']).describe('Potential impact if the risk materializes.'),
    mitigationStrategy: z.string().describe('Proposed strategy to mitigate the risk.'),
    anomalyDetected: z.boolean().describe('Whether this risk represents an anomaly in the data.'),
    reasoning: z.string().describe('The reasoning behind the risk identification and mitigation strategy for this specific risk.'),
  })).describe('List of identified risks for this domain.'),
  summary: z.string().describe('Overall summary of risk findings for this domain, highlighting key insights and patterns.'),
  overallRiskScore: z.number().min(0).max(100).describe('A numerical score for the risk level in this specific domain (0-100), where higher means higher risk.'),
});

const OrganizationalDataInputSchema = z.object({
  companyName: z.string().describe('The name of the organization for which the risk analysis is being performed.'),
  financialData: z.record(z.string(), z.any()).describe('Comprehensive financial data (e.g., balance sheets, income statements, cash flow, debt ratios) in JSON format.'),
  cybersecurityReports: z.record(z.string(), z.any()).describe('Detailed cybersecurity reports (e.g., vulnerability scans, incident logs, access controls, threat intelligence) in JSON format.'),
  operationalMetrics: z.record(z.string(), z.any()).describe('Key operational metrics (e.g., supply chain performance, production efficiency, incident response times, process adherence) in JSON format.'),
  complianceDocuments: z.record(z.string(), z.any()).describe('Relevant compliance documents and audit results (e.g., regulatory findings, internal audit reports, policy adherence) in JSON format.'),
  strategicMarketReports: z.record(z.string(), z.any()).describe('Strategic and market analysis reports (e.g., market share, competitor analysis, industry trends, innovation pipeline) in JSON format.'),
}).describe('Comprehensive mock organizational data for risk analysis.');

export type InitiateComprehensiveRiskAnalysisInput = z.infer<typeof OrganizationalDataInputSchema>;

const AgentPromptInputSchema = z.object({
  companyName: z.string().describe('The name of the organization.'),
  financialData: z.string().describe('Stringified JSON of financial data.'),
  cybersecurityReports: z.string().describe('Stringified JSON of cybersecurity reports.'),
  operationalMetrics: z.string().describe('Stringified JSON of operational metrics.'),
  complianceDocuments: z.string().describe('Stringified JSON of compliance documents.'),
  strategicMarketReports: z.string().describe('Stringified JSON of strategic/market reports.'),
}).describe('Pre-processed organizational data with complex objects stringified for direct inclusion in prompts.');

const ComprehensiveRiskAnalysisOutputSchema = z.object({
  overallRiskIndex: z.number().min(0).max(100).describe('A numerical score representing the aggregated overall organizational risk (0-100), where higher means higher risk.'),
  overallRiskLevel: z.enum(['Low', 'Medium', 'High', 'Critical']).describe('Categorical representation of overall risk across the organization, derived from the overallRiskIndex.'),
  anomaliesSummary: z.string().describe('A combined summary of critical anomalies detected across all risk domains, highlighting the most significant issues.'),
  globalMitigationStrategies: z.array(z.string()).describe('High-level, overarching mitigation strategies applicable across multiple organizational domains to address aggregated risks.'),
  domainAnalysis: z.object({
    financial: AgentOutputSchema,
    cybersecurity: AgentOutputSchema,
    operational: AgentOutputSchema,
    compliance: AgentOutputSchema,
    strategicMarket: AgentOutputSchema,
  }).describe('Detailed risk analysis and insights from each specialized AI agent, including their individual risk scores.'),
  aggregatedReasoning: z.string().describe('Comprehensive reasoning for the overall risk assessment, including how individual domain analyses were combined and prioritized, and the rationale behind the global mitigation strategies.'),
});

export type InitiateComprehensiveRiskAnalysisOutput = z.infer<typeof ComprehensiveRiskAnalysisOutputSchema>;

// --- Prompts ---

const financialRiskAgentPrompt = ai.definePrompt({
  name: 'financialRiskAgentPrompt',
  input: { schema: AgentPromptInputSchema },
  output: { schema: AgentOutputSchema },
  prompt: `You are an expert Financial Risk Analyst. Analyze the financial data for "{{{companyName}}}". 
  Financial Data: {{{financialData}}}
  Focus on identifying risks, detecting anomalies, and proposing mitigation strategies.`,
});

const cybersecurityRiskAgentPrompt = ai.definePrompt({
  name: 'cybersecurityRiskAgentPrompt',
  input: { schema: AgentPromptInputSchema },
  output: { schema: AgentOutputSchema },
  prompt: `You are an expert Cybersecurity Risk Analyst. Analyze the cybersecurity reports for "{{{companyName}}}".
  Cybersecurity Data: {{{cybersecurityReports}}}
  Focus on identifying risks, detecting anomalies, and proposing mitigation strategies.`,
});

const operationalRiskAgentPrompt = ai.definePrompt({
  name: 'operationalRiskAgentPrompt',
  input: { schema: AgentPromptInputSchema },
  output: { schema: AgentOutputSchema },
  prompt: `You are an expert Operational Risk Analyst. Analyze the operational metrics for "{{{companyName}}}".
  Operational Data: {{{operationalMetrics}}}
  Focus on identifying risks, detecting anomalies, and proposing mitigation strategies.`,
});

const complianceRiskAgentPrompt = ai.definePrompt({
  name: 'complianceRiskAgentPrompt',
  input: { schema: AgentPromptInputSchema },
  output: { schema: AgentOutputSchema },
  prompt: `You are an expert Compliance Risk Analyst. Analyze the compliance documents for "{{{companyName}}}".
  Compliance Data: {{{complianceDocuments}}}
  Focus on identifying risks, detecting anomalies, and proposing mitigation strategies.`,
});

const strategicMarketRiskAgentPrompt = ai.definePrompt({
  name: 'strategicMarketRiskAgentPrompt',
  input: { schema: AgentPromptInputSchema },
  output: { schema: AgentOutputSchema },
  prompt: `You are an expert Strategic and Market Risk Analyst. Analyze the strategic/market reports for "{{{companyName}}}".
  Market Data: {{{strategicMarketReports}}}
  Focus on identifying risks, detecting anomalies, and proposing mitigation strategies.`,
});

const AggregatorPromptInputSchema = z.object({
  companyName: z.string(),
  financialAnalysis: AgentOutputSchema,
  cybersecurityAnalysis: AgentOutputSchema,
  operationalAnalysis: AgentOutputSchema,
  complianceAnalysis: AgentOutputSchema,
  strategicMarketAnalysis: AgentOutputSchema,
});

const riskAggregatorPrompt = ai.definePrompt({
  name: 'riskAggregatorPrompt',
  input: { schema: AggregatorPromptInputSchema },
  output: { schema: ComprehensiveRiskAnalysisOutputSchema },
  prompt: `You are the central AI Risk Coordinator for "{{{companyName}}}". 
  Aggregate these analyses into a holistic profile:
  - Financial: {{{financialAnalysis}}}
  - Cyber: {{{cybersecurityAnalysis}}}
  - Operational: {{{operationalAnalysis}}}
  - Compliance: {{{complianceAnalysis}}}
  - Strategic: {{{strategicMarketAnalysis}}}
  Provide overall index, summary, and global strategies.`,
});

const initiateComprehensiveRiskAnalysisFlow = ai.defineFlow(
  {
    name: 'initiateComprehensiveRiskAnalysisFlow',
    inputSchema: OrganizationalDataInputSchema,
    outputSchema: ComprehensiveRiskAnalysisOutputSchema,
  },
  async (input) => {
    if (!process.env.GOOGLE_GENAI_API_KEY && !process.env.GEMINI_API_KEY) {
      throw new Error('API Key is missing. Please add GOOGLE_GENAI_API_KEY to your environment.');
    }

    const stringifiedAgentInput: z.infer<typeof AgentPromptInputSchema> = {
      companyName: input.companyName,
      financialData: JSON.stringify(input.financialData),
      cybersecurityReports: JSON.stringify(input.cybersecurityReports),
      operationalMetrics: JSON.stringify(input.operationalMetrics),
      complianceDocuments: JSON.stringify(input.complianceDocuments),
      strategicMarketReports: JSON.stringify(input.strategicMarketReports),
    };

    // Run in parallel for efficiency
    const results = await Promise.allSettled([
      financialRiskAgentPrompt(stringifiedAgentInput),
      cybersecurityRiskAgentPrompt(stringifiedAgentInput),
      operationalRiskAgentPrompt(stringifiedAgentInput),
      complianceRiskAgentPrompt(stringifiedAgentInput),
      strategicMarketRiskAgentPrompt(stringifiedAgentInput),
    ]);

    const successes = results.map(r => r.status === 'fulfilled' ? r.value.output : null);
    if (successes.some(s => !s)) {
      throw new Error('One or more risk agents failed to respond. Check your API limits.');
    }

    const aggregatorInput: z.infer<typeof AggregatorPromptInputSchema> = {
      companyName: input.companyName,
      financialAnalysis: successes[0]!,
      cybersecurityAnalysis: successes[1]!,
      operationalAnalysis: successes[2]!,
      complianceAnalysis: successes[3]!,
      strategicMarketAnalysis: successes[4]!,
    };

    const { output } = await riskAggregatorPrompt(aggregatorInput);
    if (!output) throw new Error('Aggregation failed.');
    return output;
  }
);

export async function initiateComprehensiveRiskAnalysis(
  input: InitiateComprehensiveRiskAnalysisInput
): Promise<InitiateComprehensiveRiskAnalysisOutput> {
  return initiateComprehensiveRiskAnalysisFlow(input);
}
