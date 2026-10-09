/* eslint-disable */
require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function testPro() {
  try {
    const res = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: 'hi'
    });
    console.log('PRO WORKED:', res.text);
  } catch (err) {
    console.log('PRO FAILED:', err.status, err.message);
  }
}
testPro();
