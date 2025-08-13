'use server';

import { generateStrongPassword, GenerateStrongPasswordInput } from "@/ai/flows/generate-strong-password";
import { suggestPassword, SuggestPasswordInput } from "@/ai/flows/suggest-password";
import { z } from "zod";

const generatePasswordActionSchema = z.object({
    length: z.number(),
    includeNumbers: z.boolean(),
    includeSymbols: z.boolean(),
});

export async function generatePasswordAction(input: GenerateStrongPasswordInput) {
    const parsedInput = generatePasswordActionSchema.safeParse(input);
    if (!parsedInput.success) {
        throw new Error("Invalid input for generating password.");
    }
    return await generateStrongPassword(parsedInput.data);
}

const suggestPasswordActionSchema = z.object({
    websiteOrAppName: z.string(),
    storedPasswords: z.array(z.object({
        websiteOrAppName: z.string(),
        password: z.string(),
    })),
});

export async function suggestPasswordAction(input: SuggestPasswordInput) {
    const parsedInput = suggestPasswordActionSchema.safeParse(input);
    if (!parsedInput.success) {
        throw new Error("Invalid input for suggesting password.");
    }
    return await suggestPassword(parsedInput.data);
}
