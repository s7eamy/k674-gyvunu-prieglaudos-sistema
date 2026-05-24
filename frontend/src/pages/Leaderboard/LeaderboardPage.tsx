import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/layout/Navbar';
import { getLeaderboard } from '../../services/leaderboardService';
import type { User } from '../../types/User';
import './LeaderboardPage.css';

export default function LeaderboardPage() {
  const { t } = useTranslation('leaderboard');
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
        const errorMsg = err instanceof Error ? err.message : t('loadFailed');
        setError(errorMsg);
        console.error('Fetch leaderboard failed', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboard();
  }, [t]);

  return (
    <>
      <Navbar />

      <main className="leaderboard-page">
        <section className="leaderboard-page__hero">
          <div className="leaderboard-page__hero-content">
            <header className="leaderboard-page__header">
              <h1>{t('heroTitle')}</h1>
              <p>{t('heroSubtitle')}</p>
            </header>
          </div>
        </section>
        {isLoading && <p>{t('loading')}</p>}

        {error && <p>{t('errorPrefix', { message: error })}</p>}

        {!isLoading && !error && leaderboardUsers.length === 0 && <p>{t('empty')}</p>}

        {!isLoading && !error && leaderboardUsers.length > 0 && (
          <div className="table-responsive">
            <table className="leaderboard-page__table">
              <thead>
                <tr>
                  <th>{t('columns.rank')}</th>
                  <th>{t('columns.user')}</th>
                  <th>{t('columns.totalPoints')}</th>
                  <th>{t('columns.donationPoints')}</th>
                  <th>{t('columns.volunteerPoints')}</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardUsers.map((user, index) => (
                  <tr key={user.id}>
                    <td className="leaderboard-page__rank-cell">
                      {['🥇', '🥈', '🥉'][index] || `#${index + 1}`}
                    </td>
                    <td className="leaderboard-page__user-cell">
                      <div className="leaderboard-page__avatar">{user.name.charAt(0).toUpperCase()}</div>
                      {user.name}
                    </td>
                    <td>{user.donation_points + user.volunteer_points * 25}</td>
                    <td>{user.donation_points}</td>
                    <td>{user.volunteer_points * 25}</td>
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
