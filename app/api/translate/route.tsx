import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const languageNames = {
  vi: 'Vietnamese',
  zh: 'Chinese',
  ja: 'Japanese',
  ko: 'Korean'
};

export async function POST(request: Request) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: 'Gemini API key is missing' }, { status: 500 });
  }

  try {
    const { text, targetLang } = await request.json();
    
    if (!text || !targetLang) {
      return NextResponse.json({ error: 'Text and target language are required' }, { status: 400 });
    }

    if (!(targetLang in languageNames)) {
      return NextResponse.json({ error: 'Invalid target language' }, { status: 400 });
    }

    const prompt = `Translate this text to ${languageNames[targetLang as keyof typeof languageNames]}, maintaining the original meaning and tone: "${text}"`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const translatedText = response.text();

    return NextResponse.json({ translatedText });
    
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json({ 
      error: 'Translation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}