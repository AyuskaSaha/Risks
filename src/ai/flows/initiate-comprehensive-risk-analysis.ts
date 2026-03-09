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

// Helper Schema for consistent output from each specialized agent
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

// Input schema for the main flow, representing comprehensive mock organizational data
const OrganizationalDataInputSchema = z.object({
  companyName: z.string().describe('The name of the organization for which the risk analysis is being performed.'),
  financialData: z.record(z.string(), z.any()).describe('Comprehensive financial data (e.g., balance sheets, income statements, cash flow, debt ratios) in JSON format.'),
  cybersecurityReports: z.record(z.string(), z.any()).describe('Detailed cybersecurity reports (e.g., vulnerability scans, incident logs, access controls, threat intelligence) in JSON format.'),
  operationalMetrics: z.record(z.string(), z.any()).describe('Key operational metrics (e.g., supply chain performance, production efficiency, incident response times, process adherence) in JSON format.'),
  complianceDocuments: z.record(z.string(), z.any()).describe('Relevant compliance documents and audit results (e.g., regulatory findings, internal audit reports, policy adherence) in JSON format.'),
  strategicMarketReports: z.record(z.string(), z.any()).describe('Strategic and market analysis reports (e.g., market share, competitor analysis, industry trends, innovation pipeline) in JSON format.'),
}).describe('Comprehensive mock organizational data for risk analysis.');

export type InitiateComprehensiveRiskAnalysisInput = z.infer<typeof OrganizationalDataInputSchema>;

// Input schema for individual agent prompts (data stringified)
const AgentPromptInputSchema = z.object({
  companyName: z.string().describe('The name of the organization.'),
  financialData: z.string().describe('Stringified JSON of financial data.'),
  cybersecurityReports: z.string().describe('Stringified JSON of cybersecurity reports.'),
  operationalMetrics: z.string().describe('Stringified JSON of operational metrics.'),
  complianceDocuments: z.string().describe('Stringified JSON of compliance documents.'),
  strategicMarketReports: z.string().describe('Stringified JSON of strategic/market reports.'),
}).describe('Pre-processed organizational data with complex objects stringified for direct inclusion in prompts.');

// Output schema for the main comprehensive risk analysis flow
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

// --- Prompts for Individual Agents ---

const financialRiskAgentPrompt = ai.definePrompt({
  name: 'financialRiskAgentPrompt',
  input: { schema: AgentPromptInputSchema }, // Use the stringified input schema
  output: { schema: AgentOutputSchema },
  prompt: `You are an expert Financial Risk Analyst. Your task is to meticulously analyze the provided financial data for the company "{{{companyName}}}", identify potential financial risks, detect anomalies, predict their probability and impact, and propose clear, actionable mitigation strategies.
  
  Financial Data (JSON):
  {{{financialData}}}
  
  Based on this data, provide your comprehensive analysis in a structured JSON format conforming precisely to the AgentOutputSchema, focusing exclusively on financial risks. Your response must highlight specific financial anomalies and provide detailed, evidence-based reasoning for each identified risk, its assessment, and the proposed mitigation. Ensure your overallRiskScore accurately reflects the financial risk posture.`,
});

const cybersecurityRiskAgentPrompt = ai.definePrompt({
  name: 'cybersecurityRiskAgentPrompt',
  input: { schema: AgentPromptInputSchema },
  output: { schema: AgentOutputSchema },
  prompt: `You are an expert Cybersecurity Risk Analyst. Your task is to meticulously analyze the provided cybersecurity reports and data for the company "{{{companyName}}}", identify potential cybersecurity risks, detect anomalies, predict their probability and impact, and propose clear, actionable mitigation strategies.
  
  Cybersecurity Reports (JSON):
  {{{cybersecurityReports}}}
  
  Based on this data, provide your comprehensive analysis in a structured JSON format conforming precisely to the AgentOutputSchema, focusing exclusively on cybersecurity risks. Your response must highlight specific cybersecurity anomalies and provide detailed, evidence-based reasoning for each identified risk, its assessment, and the proposed mitigation. Ensure your overallRiskScore accurately reflects the cybersecurity risk posture.`,
});

const operationalRiskAgentPrompt = ai.definePrompt({
  name: 'operationalRiskAgentPrompt',
  input: { schema: AgentPromptInputSchema },
  output: { schema: AgentOutputSchema },
  prompt: `You are an expert Operational Risk Analyst. Your task is to meticulously analyze the provided operational metrics and data for the company "{{{companyName}}}", identify potential operational risks, detect anomalies, predict their probability and impact, and propose clear, actionable mitigation strategies.
  
  Operational Metrics (JSON):
  {{{operationalMetrics}}}
  
  Based on this data, provide your comprehensive analysis in a structured JSON format conforming precisely to the AgentOutputSchema, focusing exclusively on operational risks. Your response must highlight specific operational anomalies and provide detailed, evidence-based reasoning for each identified risk, its assessment, and the proposed mitigation. Ensure your overallRiskScore accurately reflects the operational risk posture.`,
});

const complianceRiskAgentPrompt = ai.definePrompt({
  name: 'complianceRiskAgentPrompt',
  input: { schema: AgentPromptInputSchema },
  output: { schema: AgentOutputSchema },
  prompt: `You are an expert Compliance Risk Analyst. Your task is to meticulously analyze the provided compliance documents and data for the company "{{{companyName}}}", identify potential compliance risks, detect anomalies, predict their probability and impact, and propose clear, actionable mitigation strategies.
  
  Compliance Documents (JSON):
  {{{complianceDocuments}}}
  
  Based on this data, provide your comprehensive analysis in a structured JSON format conforming precisely to the AgentOutputSchema, focusing exclusively on compliance risks. Your response must highlight specific compliance anomalies and provide detailed, evidence-based reasoning for each identified risk, its assessment, and the proposed mitigation. Ensure your overallRiskScore accurately reflects the compliance risk posture.`,
});

const strategicMarketRiskAgentPrompt = ai.definePrompt({
  name: 'strategicMarketRiskAgentPrompt',
  input: { schema: AgentPromptInputSchema },
  output: { schema: AgentOutputSchema },
  prompt: `You are an expert Strategic and Market Risk Analyst. Your task is to meticulously analyze the provided strategic and market analysis reports for the company "{{{companyName}}}", identify potential strategic and market risks, detect anomalies, predict their probability and impact, and propose clear, actionable mitigation strategies.
  
  Strategic and Market Reports (JSON):
  {{{strategicMarketReports}}}
  
  Based on this data, provide your comprehensive analysis in a structured JSON format conforming precisely to the AgentOutputSchema, focusing exclusively on strategic and market risks. Your response must highlight specific strategic/market anomalies and provide detailed, evidence-based reasoning for each identified risk, its assessment, and the proposed mitigation. Ensure your overallRiskScore accurately reflects the strategic and market risk posture.`,
});

// --- Prompt for Aggregator Agent ---

// Input schema for the aggregator prompt
const AggregatorPromptInputSchema = z.object({
  companyName: z.string().describe('The name of the organization.'),
  financialAnalysis: AgentOutputSchema.describe('The detailed financial risk analysis report from the Financial Risk Agent.'),
  cybersecurityAnalysis: AgentOutputSchema.describe('The detailed cybersecurity risk analysis report from the Cybersecurity Risk Agent.'),
  operationalAnalysis: AgentOutputSchema.describe('The detailed operational risk analysis report from the Operational Risk Agent.'),
  complianceAnalysis: AgentOutputSchema.describe('The detailed compliance risk analysis report from the Compliance Risk Agent.'),
  strategicMarketAnalysis: AgentOutputSchema.describe('The detailed strategic and market risk analysis report from the Strategic/Market Risk Agent.'),
}).describe('Inputs combining all individual risk agent analyses for aggregation.');

const riskAggregatorPrompt = ai.definePrompt({
  name: 'riskAggregatorPrompt',
  input: { schema: AggregatorPromptInputSchema },
  output: { schema: ComprehensiveRiskAnalysisOutputSchema },
  prompt: `You are the central AI Risk Coordinator, responsible for aggregating and synthesizing risk analyses from various specialized AI agents for the company "{{{companyName}}}". Your goal is to provide a holistic and comprehensive view of the organization's risk profile.
  
  You have received the following detailed risk analyses:
  
  Financial Risk Analysis:
  {{{financialAnalysis}}}
  
  Cybersecurity Risk Analysis:
  {{{cybersecurityAnalysis}}}
  
  Operational Risk Analysis:
  {{{operationalAnalysis}}}
  
  Compliance Risk Analysis:
  {{{complianceAnalysis}}}
  
  Strategic/Market Risk Analysis:
  {{{strategicMarketAnalysis}}}
  
  Your primary tasks are to:
  1.  Review and combine the key insights, identified risks, and anomalies from all individual domain analyses.
  2.  Identify overarching themes, interdependencies between different risk categories, and critical anomalies that span multiple domains or have a widespread organizational impact.
  3.  Calculate an 'overallRiskIndex' (0-100) and 'overallRiskLevel' (Low, Medium, High, Critical) based on the combined severity, likelihood, and interconnectedness of all identified risks across the organization. This should be a synthesized score, not just an average.
  4.  Provide a concise yet thorough 'anomaliesSummary' of the most significant and impactful anomalies detected across the entire organization.
  5.  Propose 'globalMitigationStrategies' that address cross-cutting risks, leverage synergistic actions, and provide a holistic approach to organizational risk reduction. These should be high-level and strategic.
  6.  Provide detailed 'aggregatedReasoning' explaining your overall risk assessment, how different domain analyses interact and influence each other, and the rationale behind the global mitigation strategies and the overall risk score.
  
  Output your comprehensive risk analysis in a structured JSON format conforming precisely to the ComprehensiveRiskAnalysisOutputSchema.
  `,
});

// --- Main Flow Definition ---

const initiateComprehensiveRiskAnalysisFlow = ai.defineFlow(
  {
    name: 'initiateComprehensiveRiskAnalysisFlow',
    inputSchema: OrganizationalDataInputSchema,
    outputSchema: ComprehensiveRiskAnalysisOutputSchema,
  },
  async (input) => {
    // Prepare input by stringifying complex objects for agent prompts
    const stringifiedAgentInput: z.infer<typeof AgentPromptInputSchema> = {
      companyName: input.companyName,
      financialData: JSON.stringify(input.financialData, null, 2),
      cybersecurityReports: JSON.stringify(input.cybersecurityReports, null, 2),
      operationalMetrics: JSON.stringify(input.operationalMetrics, null, 2),
      complianceDocuments: JSON.stringify(input.complianceDocuments, null, 2),
      strategicMarketReports: JSON.stringify(input.strategicMarketReports, null, 2),
    };

    // Run all five specialized AI agent prompts in parallel
    const [
      financialAnalysis,
      cybersecurityAnalysis,
      operationalAnalysis,
      complianceAnalysis,
      strategicMarketAnalysis,
    ] = await Promise.all([
      financialRiskAgentPrompt(stringifiedAgentInput).then(response => response.output!),
      cybersecurityRiskAgentPrompt(stringifiedAgentInput).then(response => response.output!),
      operationalRiskAgentPrompt(stringifiedAgentInput).then(response => response.output!),
      complianceRiskAgentPrompt(stringifiedAgentInput).then(response => response.output!),
      strategicMarketRiskAgentPrompt(stringifiedAgentInput).then(response => response.output!),
    ]);

    // Prepare input for the aggregator prompt using the outputs from individual agents
    const aggregatorInput: z.infer<typeof AggregatorPromptInputSchema> = {
      companyName: input.companyName,
      financialAnalysis,
      cybersecurityAnalysis,
      operationalAnalysis,
      complianceAnalysis,
      strategicMarketAnalysis,
    };

    // Run the aggregator prompt to synthesize the comprehensive risk analysis
    const { output } = await riskAggregatorPrompt(aggregatorInput);
    return output!;
  }
);

// --- Exported Wrapper Function ---

export async function initiateComprehensiveRiskAnalysis(
  input: InitiateComprehensiveRiskAnalysisInput
): Promise<InitiateComprehensiveRiskAnalysisOutput> {
  return initiateComprehensiveRiskAnalysisFlow(input);
}
