import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');
  
  const baseUrl = 'https://newsapi.org/v2/everything';
  const apiKey = process.env.NEWS_API_KEY;
  
  const apiUrl = symbol 
    ? `${baseUrl}?q=${symbol}&sortBy=popularity&apiKey=${apiKey}`
    : `${baseUrl}?q=stocks&sortBy=popularity&apiKey=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    return NextResponse.json({ news: data.articles });
  } catch (error) {
    return NextResponse.json({ error: `${error}` }, { status: 500 });
  }
}
