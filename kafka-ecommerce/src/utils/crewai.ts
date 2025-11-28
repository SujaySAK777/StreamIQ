import fetch from 'node-fetch';
import logger from './logger';
import { config } from '../config';

export async function generateUiCardWithCrewAI(a: any) {
  // If API_KEY isn't set, return a templated fallback
  const apiKey = process.env.CREWAI_API_KEY;
  if (!apiKey) return null;

  // Build a simple prompt to create a short UI card
  const prompt = `Create a UI card headline <=6 words, subtext <=12 words, rationale <=20 words, CTA <=3 words for the following product and selected promotion: ${JSON.stringify(a)}`;

  try {
    const res = await fetch(process.env.CREWAI_API_URL || 'https://api.crewai.ai/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt, max_tokens: 150 })
    });
    const json: any = await res.json();
    // Expect the LLM to return a JSON object or text; attempt to parse
    if (json && json.output) {
      return json.output;
    }
    return null;
  } catch (e) {
    logger.warn('crewai generation failed', e);
    return null;
  }
}

export async function generateExplanationWithCrewAI(a: any) {
  const apiKey = process.env.CREWAI_API_KEY;
  if (!apiKey) return null;
  const prompt = `Create a short 20-word rationale for why offering a promotion to this product makes sense. Input: ${JSON.stringify(a)}`;
  try {
    const res = await fetch(process.env.CREWAI_API_URL || 'https://api.crewai.ai/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt, max_tokens: 80 })
    });
    const json: any = await res.json();
    if (json && json.output) return json.output;
    return null;
  } catch (e) {
    logger.warn('crewai explanation generation failed', e);
    return null;
  }
}

export default { generateUiCardWithCrewAI };
