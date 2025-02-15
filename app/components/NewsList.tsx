export type NewsItem = {
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
  };
  
  interface NewsListProps {
    news: NewsItem[];
  }
  
  const NewsList: React.FC<NewsListProps> = ({ news }) => {
    return (
      <div className="mt-4">
        {news && news.length > 0 ? (
          news.map((item, index) => (
            <div key={index} className="border-b py-4">
              {item.urlToImage && (
                <img src={item.urlToImage} alt={item.title} className="w-full h-64 object-cover rounded" />
              )}
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                <h3 className="font-bold">{item.title}</h3>
              </a>
              <p>{item.description}</p>
              <small>{new Date(item.publishedAt).toLocaleString()}</small>
            </div>
          ))
        ) : (
          <p>Không có tin tức nào.</p>
        )}
      </div>
    );
  };
  
  export default NewsList;
  