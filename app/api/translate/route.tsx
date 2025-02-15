import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export async function POST(request: Request) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: 'Gemini API key is missing' }, { status: 500 });
  }

  try {
    const { text } = await request.json();
    
    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const prompt = `Translate this text to Vietnamese, maintaining the original meaning and tone: "${text}"`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const translatedText = response.text();

    return NextResponse.json({ translatedText });
    
  } catch (error: unknown) {
    console.error('Translation error:', error);
    return NextResponse.json({ 
      error: 'Translation failed',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}