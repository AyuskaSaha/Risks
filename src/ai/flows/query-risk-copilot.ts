'use server';
/**
 * @fileOverview An AI Risk Copilot Chatbot that answers questions based on combined AI agent outputs.
 *
 * - queryRiskCopilot - A function that handles queries for the AI Risk Copilot Chatbot.
 * - QueryRiskCopilotInput - The input type for the queryRiskCopilot function.
 * - QueryRiskCopilotOutput - The return type for the queryRiskCopilot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QueryRiskCopilotInputSchema = z.object({
  userQuery: z.string().describe('The question or query from the risk analyst.'),
  combinedAgentOutputs: z.string().describe(
    'A comprehensive summary or structured JSON string of the combined outputs from all specialized AI risk analysis agents (Financial, Cybersecurity, Operational, Compliance, Strategic/Market).'
  ),
});
export type QueryRiskCopilotInput = z.infer<typeof QueryRiskCopilotInputSchema>;

const QueryRiskCopilotOutputSchema = z.string().describe('The AI Risk Copilot chatbot\'s response to the query.');
export type QueryRiskCopilotOutput = z.infer<typeof QueryRiskCopilotOutputSchema>;

export async function queryRiskCopilot(input: QueryRiskCopilotInput): Promise<QueryRiskCopilotOutput> {
  return queryRiskCopilotFlow(input);
}

const queryRiskCopilotPrompt = ai.definePrompt({
  name: 'queryRiskCopilotPrompt',
  input: {schema: QueryRiskCopilotInputSchema},
  output: {schema: QueryRiskCopilotOutputSchema},
  prompt: `You are an expert AI Risk Copilot. Your role is to assist risk analysts by answering their questions, explaining dashboard metrics, and summarizing complex risk assessments.
You will base your answers solely on the provided combined risk agent outputs. Do not invent information. If you cannot answer a question based on the provided context, state that you cannot find the information.

Combined Risk Agent Outputs:
\`\`\`json
{{{combinedAgentOutputs}}}
\`\`\`

User Query: {{{userQuery}}}

Based on the combined risk agent outputs, please provide a concise and clear response to the user's query.`,
});

const queryRiskCopilotFlow = ai.defineFlow(
  {
    name: 'queryRiskCopilotFlow',
    inputSchema: QueryRiskCopilotInputSchema,
    outputSchema: QueryRiskCopilotOutputSchema,
  },
  async input => {
    const {output} = await queryRiskCopilotPrompt(input);
    return output!;
  }
);
