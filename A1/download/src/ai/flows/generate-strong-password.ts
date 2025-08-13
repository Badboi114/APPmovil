'use server';

/**
 * @fileOverview Password generation flow using GenAI.
 *
 * - generateStrongPassword - A function that generates a strong password based on user-specified criteria.
 * - GenerateStrongPasswordInput - The input type for the generateStrongPassword function.
 * - GenerateStrongPasswordOutput - The return type for the generateStrongPassword function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStrongPasswordInputSchema = z.object({
  length: z
    .number()
    .min(8)
    .max(64)
    .default(16)
    .describe('The desired length of the password (8-64 characters).'),
  includeNumbers: z
    .boolean()
    .default(true)
    .describe('Whether to include numbers in the password.'),
  includeSymbols: z
    .boolean()
    .default(true)
    .describe('Whether to include symbols in the password.'),
});
export type GenerateStrongPasswordInput = z.infer<
  typeof GenerateStrongPasswordInputSchema
>;

const GenerateStrongPasswordOutputSchema = z.object({
  password: z.string().describe('The generated strong password.'),
});
export type GenerateStrongPasswordOutput = z.infer<
  typeof GenerateStrongPasswordOutputSchema
>;

export async function generateStrongPassword(
  input: GenerateStrongPasswordInput
): Promise<GenerateStrongPasswordOutput> {
  return generateStrongPasswordFlow(input);
}

const generateStrongPasswordPrompt = ai.definePrompt({
  name: 'generateStrongPasswordPrompt',
  input: {schema: GenerateStrongPasswordInputSchema},
  output: {schema: GenerateStrongPasswordOutputSchema},
  prompt: `You are a password generator. Generate a strong, random password based on the following criteria:\n\nLength: {{length}} characters\nInclude numbers: {{#if includeNumbers}}Yes{{else}}No{{/if}}\nInclude symbols: {{#if includeSymbols}}Yes{{else}}No{{/if}}\n\nThe password should be unpredictable and suitable for use on any website or application.\n\nRespond only with the password itself, do not include any additional explanation or text.`,
});

const generateStrongPasswordFlow = ai.defineFlow(
  {
    name: 'generateStrongPasswordFlow',
    inputSchema: GenerateStrongPasswordInputSchema,
    outputSchema: GenerateStrongPasswordOutputSchema,
  },
  async input => {
    const {output} = await generateStrongPasswordPrompt(input);
    return output!;
  }
);
