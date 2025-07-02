'use server';

/**
 * @fileOverview A flow to generate illustrative icons for each of the 15 electrical services.
 *
 * - generateServiceIcons - A function that generates icons for the electrical services.
 * - GenerateServiceIconsInput - The input type for the generateServiceIcons function.
 * - GenerateServiceIconsOutput - The return type for the generateServiceIcons function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateServiceIconsInputSchema = z.object({
  serviceName: z.string().describe('The name of the electrical service.'),
  primaryColor: z.string().describe('The primary color of the brand in hex format (e.g., #2E9AFE).'),
  accentColor: z.string().describe('The accent color of the brand in hex format (e.g., #FFB347).'),
});
export type GenerateServiceIconsInput = z.infer<typeof GenerateServiceIconsInputSchema>;

const GenerateServiceIconsOutputSchema = z.object({
  iconDataUri: z.string().describe('The data URI of the generated icon.'),
});
export type GenerateServiceIconsOutput = z.infer<typeof GenerateServiceIconsOutputSchema>;

export async function generateServiceIcons(input: GenerateServiceIconsInput): Promise<GenerateServiceIconsOutput> {
  return generateServiceIconsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateServiceIconPrompt',
  input: {schema: GenerateServiceIconsInputSchema},
  output: {schema: GenerateServiceIconsOutputSchema},
  prompt: `Generate an illustrative icon for the electrical service "{{{serviceName}}}".  The icon should be in the brand's primary color "{{{primaryColor}}}" and use the accent color "{{{accentColor}}}" for highlights.  The icon should be simple, clear, and suitable for use on a website to represent the service.

Output should be a data URI representing a PNG image.`, 
});

const generateServiceIconsFlow = ai.defineFlow(
  {
    name: 'generateServiceIconsFlow',
    inputSchema: GenerateServiceIconsInputSchema,
    outputSchema: GenerateServiceIconsOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      // IMPORTANT: ONLY the googleai/gemini-2.0-flash-preview-image-generation model is able to generate images. You MUST use exactly this model to generate images.
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: input.serviceName + ". The icon should be in the brand's primary color '" + input.primaryColor + "' and use the accent color '" + input.accentColor + "' for highlights.  The icon should be simple, clear, and suitable for use on a website to represent the service.",
      config: {
        responseModalities: ['TEXT', 'IMAGE'], // MUST provide both TEXT and IMAGE, IMAGE only won't work
      },
    });

    if (!media?.url) {
      throw new Error('No image was generated.');
    }

    return {iconDataUri: media.url};
  }
);
