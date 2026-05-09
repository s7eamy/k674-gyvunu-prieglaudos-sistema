// Posts page — public page for viewing all shelter posts
import { useEffect, useState } from 'react';

import Navbar from '../../components/layout/Navbar';
import { getPosts } from '../../services/postService';
import type { Post } from '../../types/Post';
import './PostsPage.css';

export default function PostsPage() {
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
        const errorMsg = err instanceof Error ? err.message : 'Failed to load posts';
        setError(errorMsg);
        console.error('Fetch posts failed', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <>
      <Navbar />

      <main className="posts-page">
        <header className="posts-page__header">
          <h1>Shelter News & Stories</h1>
          <p>Read updates and stories from our shelter</p>
        </header>

        {isLoading && <p className="posts-page__loading">Loading posts...</p>}

        {error && <p className="posts-page__error">Error: {error}</p>}

        {!isLoading && !error && posts.length === 0 && (
          <p className="posts-page__empty">No posts yet. Check back soon!</p>
        )}

        {!isLoading && !error && posts.length > 0 && (
          <section className="posts-page__grid" aria-label="Shelter posts">
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
                    <span className="posts-page__card-date">{formatDate(post.created_at)}</span>
                    <span className="posts-page__card-author">By Admin #{post.created_by}</span>
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
