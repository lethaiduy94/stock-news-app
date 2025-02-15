import { useState } from 'react';
import axios from 'axios';
import Image from 'next/image';

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

const NewsCard = ({ news }: { news: NewsItem }) => {
  const [isTranslated, setIsTranslated] = useState(false);
  const [translatedTitle, setTranslatedTitle] = useState('');
  const [translatedDescription, setTranslatedDescription] = useState('');
  const [translating, setTranslating] = useState(false);

  const handleTranslate = async () => {
    if (isTranslated) {
      setIsTranslated(false);
      return;
    }

    setTranslating(true);
    try {
      const [titleRes, descRes] = await Promise.all([
        axios.post('/api/translate', { text: news.title }),
        axios.post('/api/translate', { text: news.description })
      ]);

      setTranslatedTitle(titleRes.data.translatedText);
      setTranslatedDescription(descRes.data.translatedText);
      setIsTranslated(true);
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setTranslating(false);
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-lg">
      {news.urlToImage && (
        <Image 
          src={news.urlToImage} 
          alt={news.title}
          width={800}
          height={400}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h2 className="font-bold text-xl mb-2">
          {isTranslated ? translatedTitle : news.title}
        </h2>
        <p className="text-gray-700 text-base mb-2">
          {isTranslated ? translatedDescription : news.description}
        </p>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{news.source.name}</span>
          <span>{new Date(news.publishedAt).toLocaleDateString()}</span>
        </div>
        <div className="mt-3 flex gap-2">
          <a 
            href={news.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Xem thêm
          </a>
          <button
            onClick={handleTranslate}
            disabled={translating}
            className="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-green-300"
          >
            {translating ? 'Đang dịch...' : isTranslated ? 'Bản gốc' : 'Dịch'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
