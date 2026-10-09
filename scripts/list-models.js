/* eslint-disable */
require('dotenv').config();
const localEnv = require('fs').readFileSync('.env.local', 'utf8').includes('GEMINI');

console.log('ENV.LOCAL has GEMINI vars:', localEnv);

const key = process.env.GEMINI_API_KEY;
console.log('KEY length:', key ? key.length : 0);
console.log('DIRECT_URL pooler?', (process.env.DIRECT_URL || '').includes('-pooler'));

async function listModels() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) {
    console.error('API Error:', data);
    return;
  }
  const models = data.models;
  const generate = models.filter(m => m.supportedGenerationMethods.includes('generateContent')).map(m => m.name.replace('models/', ''));
  const embed = models.filter(m => m.supportedGenerationMethods.includes('embedContent')).map(m => m.name.replace('models/', ''));
  console.log('Generate models:', generate.join(', '));
  console.log('Embed models:', embed.join(', '));
}

listModels().catch(console.error);
