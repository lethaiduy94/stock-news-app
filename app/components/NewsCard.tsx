import { useState, useEffect } from 'react';
import axios from 'axios';
import { languageNames } from '../type/Type';

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

const languages = [
  { code: 'original', name: 'Original' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'japanese' },
  { code: 'ko', name: 'Korean' },
];

const NewsCard = ({ news }: { news: NewsItem }) => {
  const [selectedLang, setSelectedLang] = useState('original');
  const [translations, setTranslations] = useState<Record<string, { title: string; description: string }>>({});
  const [translating, setTranslating] = useState(false);

  // Reset states when news changes
  useEffect(() => {
    setSelectedLang('original');
    setTranslations({});
    setTranslating(false);
  }, [news]);

  const handleLanguageChange = async (langCode: string) => {
    if (langCode === 'original') {
      setSelectedLang(langCode);
      return;
    }

    if (translations[langCode]) {
      setSelectedLang(langCode);
      return;
    }

    setTranslating(true);
    try {
      const [titleRes, descRes] = await Promise.all([
        axios.post('/api/translate', { text: news.title, targetLang: langCode }),
        axios.post('/api/translate', { text: news.description, targetLang: langCode })
      ]);

      setTranslations(prev => ({
        ...prev,
        [langCode]: {
          title: titleRes.data.translatedText,
          description: descRes.data.translatedText
        }
      }));
      setSelectedLang(langCode);
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setTranslating(false);
    }
  };

  const currentText = selectedLang === 'original' 
    ? { title: news.title, description: news.description }
    : translations[selectedLang] || { title: news.title, description: news.description };

  return (
    <div className="border rounded-lg overflow-hidden shadow-lg">
      {news.urlToImage && (
        <img 
          src={news.urlToImage} 
          alt={news.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h2 className="font-bold text-xl mb-2">{currentText.title}</h2>
        <p className="text-gray-700 text-base mb-2">{currentText.description}</p>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{news.source.name}</span>
          <span>{new Date(news.publishedAt).toLocaleDateString()}</span>
        </div>
        <div className="mt-3 flex gap-2 items-center">
          <a 
            href={news.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Read More
          </a>
          <select
            value={selectedLang}
            onChange={(e) => handleLanguageChange(e.target.value)}
            disabled={translating}
            className="border rounded px-3 py-2 bg-white"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {translating ? 'Tranlating...' : lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;