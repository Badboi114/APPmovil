// This is an AI-powered application that helps users manage their passwords.
'use server';
/**
 * @fileOverview This file contains the Genkit flow for suggesting passwords based on the active website or application.
 *
 * - suggestPassword - A function that suggests the correct password based on the active website or application.
 * - SuggestPasswordInput - The input type for the suggestPassword function.
 * - SuggestPasswordOutput - The return type for the suggestPassword function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPasswordInputSchema = z.object({
  websiteOrAppName: z
    .string()
    .describe('The name of the currently active website or application.'),
  storedPasswords: z
    .array(z.object({
      websiteOrAppName: z.string(),
      password: z.string()
    }))
    .describe('An array of stored passwords associated with website or application names.')
});
export type SuggestPasswordInput = z.infer<typeof SuggestPasswordInputSchema>;

const SuggestPasswordOutputSchema = z.object({
  suggestedPassword: z.string().describe('The suggested password for the active website or application, or an empty string if no match is found.')
});
export type SuggestPasswordOutput = z.infer<typeof SuggestPasswordOutputSchema>;

export async function suggestPassword(input: SuggestPasswordInput): Promise<SuggestPasswordOutput> {
  return suggestPasswordFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPasswordPrompt',
  input: {schema: SuggestPasswordInputSchema},
  output: {schema: SuggestPasswordOutputSchema},
  prompt: `You are a password management assistant. Given the current website or application name and a list of stored passwords, determine the correct password to use.

Website or Application Name: {{{websiteOrAppName}}}

Stored Passwords:
{{#each storedPasswords}}
- Website/App: {{this.websiteOrAppName}}, Password: {{this.password}}
{{/each}}

If there is a matching website or application name in the stored passwords, return the corresponding password in the suggestedPassword field. If there is no match, return an empty string in the suggestedPassword field.

Only suggest a password if there is an exact match to the website or app name. If the app is ambiguous, suggest nothing.
`
});

const suggestPasswordFlow = ai.defineFlow(
  {
    name: 'suggestPasswordFlow',
    inputSchema: SuggestPasswordInputSchema,
    outputSchema: SuggestPasswordOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
