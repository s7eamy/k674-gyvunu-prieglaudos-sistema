import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/layout/Navbar';
import { getPosts } from '../../services/postService';
import type { Post } from '../../types/Post';
import { useFormatters } from '../../i18n/formatters';
import './PostsPage.css';

export default function PostsPage() {
  const { t } = useTranslation('posts');
  const { formatDate } = useFormatters();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getPosts();
        setPosts(data);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : t('loadFailed');
        setError(errorMsg);
        console.error('Fetch posts failed', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [t]);

  return (
    <>
      <Navbar />

      <main className="posts-page">
        <header className="posts-page__header">
          <h1>{t('title')}</h1>
          <p>{t('subtitle')}</p>
        </header>

        {isLoading && <p className="posts-page__loading">{t('loading')}</p>}

        {error && <p className="posts-page__error">{t('errorPrefix', { message: error })}</p>}

        {!isLoading && !error && posts.length === 0 && (
          <p className="posts-page__empty">{t('empty')}</p>
        )}

        {!isLoading && !error && posts.length > 0 && (
          <section className="posts-page__grid" aria-label={t('ariaGrid')}>
            {posts.map((post) => (
              <article key={post.id} className="posts-page__card">
                {post.image_url && (
                  <div className="posts-page__card-image">
                    <img src={post.image_url} alt={post.title} />
                  </div>
                )}

                <div className="posts-page__card-content">
                  <h2 className="posts-page__card-title">{post.title}</h2>

                  <p className="posts-page__card-text">{post.content}</p>

                  <footer className="posts-page__card-meta">
                    <span className="posts-page__card-date">
                      {formatDate(post.created_at, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    <span className="posts-page__card-author">{t('author', { id: post.created_by })}</span>
                  </footer>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </>
  );
}
