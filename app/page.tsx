"use client"

import { useState, useEffect } from 'react';
import axios from 'axios';
import NewsCard from './components/NewsCard';

interface NewsItem {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

const Home = () => {
  const [symbol, setSymbol] = useState('');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInitialNews();
  }, []);

  const fetchInitialNews = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/news');
      setNews(res.data.news);
    } catch (error) {
      console.error('Error fetching initial news:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/news?symbol=${symbol}`);
      setNews(res.data.news);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Stock News</h1>
      <div className="mb-6">
        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="Enter stock symbol (e.g., AAPL, TSLA)"
          className="border p-2 rounded mr-2"
        />
        <button
          onClick={fetchNews}
          disabled={loading}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? 'Loading...' : 'Search'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {news.map((item, index) => (
          <NewsCard key={index} news={item} />
        ))}
      </div>
    </div>
  );
};

export default Home;
