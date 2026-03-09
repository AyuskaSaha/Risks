
'use server';
/**
 * @fileOverview A Genkit flow that generates a detailed project plan for mitigating a specific risk.
 *
 * - generateMitigationPlan - Function to generate a step-by-step mitigation roadmap.
 * - MitigationPlanInput - The input type containing risk details and context.
 * - MitigationPlanOutput - The return type representing the structured project plan.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MitigationPlanInputSchema = z.object({
  riskName: z.string().describe('The name of the risk to mitigate.'),
  riskDescription: z.string().describe('Detailed description of the risk.'),
  domain: z.string().describe('The organizational domain (e.g., Financial, Cybersecurity).'),
  severity: z.string().describe('The severity level of the risk.'),
});
export type MitigationPlanInput = z.infer<typeof MitigationPlanInputSchema>;

const MitigationPlanOutputSchema = z.object({
  objective: z.string().describe('The primary objective of this mitigation plan.'),
  phases: z.array(z.object({
    name: z.string().describe('Phase name (e.g., Immediate Containment, Long-term Prevention).'),
    steps: z.array(z.string()).describe('Specific actionable steps for this phase.'),
    owner: z.string().describe('Suggested department or role responsible for this phase.'),
    timeline: z.string().describe('Estimated duration for this phase.'),
  })).describe('Step-by-step phases of the mitigation project.'),
  requiredResources: z.array(z.string()).describe('List of tools, personnel, or budget required.'),
  kpis: z.array(z.string()).describe('Key Performance Indicators to measure the success of the mitigation.'),
});
export type MitigationPlanOutput = z.infer<typeof MitigationPlanOutputSchema>;

export async function generateMitigationPlan(input: MitigationPlanInput): Promise<MitigationPlanOutput> {
  return generateMitigationPlanFlow(input);
}

const mitigationPlannerPrompt = ai.definePrompt({
  name: 'mitigationPlannerPrompt',
  input: { schema: MitigationPlanInputSchema },
  output: { schema: MitigationPlanOutputSchema },
  prompt: `You are an expert Strategic Risk Consultant. Your task is to develop a high-impact, professional mitigation project plan for a specific organizational risk.

Risk Details:
- Name: {{{riskName}}}
- Domain: {{{domain}}}
- Severity: {{{severity}}}
- Context: {{{riskDescription}}}

Please provide a structured project plan that includes:
1. A clear strategic objective.
2. A phased approach (Immediate, Intermediate, Long-term).
3. Resource requirements.
4. Success metrics (KPIs).

Ensure the plan is realistic, actionable, and tailored to the specific domain context.`,
});

const generateMitigationPlanFlow = ai.defineFlow(
  {
    name: 'generateMitigationPlanFlow',
    inputSchema: MitigationPlanInputSchema,
    outputSchema: MitigationPlanOutputSchema,
  },
  async (input) => {
    const { output } = await mitigationPlannerPrompt(input);
    if (!output) throw new Error('Failed to generate mitigation plan');
    return output;
  }
);
