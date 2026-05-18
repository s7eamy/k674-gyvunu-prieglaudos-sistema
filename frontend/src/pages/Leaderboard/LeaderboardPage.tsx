// Leaderboard page - shows top 5 users by points
// may be deleted later and code repurposed for landing page
import { useEffect, useState } from 'react';

import Navbar from '../../components/layout/Navbar';
import { getLeaderboard } from '../../services/leaderboardService';
import type { User } from '../../types/User';
import './LeaderboardPage.css'

export default function PostsPage() {
  const [leaderboardUsers, setLeaderboard] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getLeaderboard();
        setLeaderboard(data);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to load leaderboard';
        setError(errorMsg);
        console.error('Fetch leaderboard failed', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <>
      <Navbar />

      <main className="leaderboard-page">
        <section className="leaderboard-page__hero">
            <div className="leaderboard-page__hero-content">
                <header className='leaderboard-page__header'>
                <h1>🏆Leaderboard🏆</h1>
                <p>Our most active users</p>
                </header>
            </div>
        </section>
        {isLoading && <p >Loading leaderboard...</p>}

        {error && <p >Error: {error}</p>}

        {!isLoading && !error && leaderboardUsers.length === 0 && (
          <p >No users found :(</p>
        )}

        {!isLoading && !error && leaderboardUsers.length > 0 && (
      <div className="table-responsive">
            <table className="leaderboard-page__table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>User</th>
                  <th>Total Points</th>
                  <th>Donation Points</th>
                  <th>Volunteering Points</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardUsers.map((user, index) => (
                  <tr key={user.id}>
                    <td className="leaderboard-page__rank-cell">{['🥇', '🥈', '🥉'][index] || '#'+(index+1)}</td>
                    <td className="leaderboard-page__user-cell">
                            <div className="leaderboard-page__avatar">
                            {user.name.charAt(0).toUpperCase()}
                            </div>
                        {user.name}
                    </td>
                    <td>{user.donation_points+user.volunteer_points*25}</td>
                    <td>{user.donation_points}</td>
                    <td>{user.volunteer_points*25}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
}
