import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminAdoptionRequests, approveAdoptionRequest, rejectAdoptionRequest } from '../../services/adoptionRequestService';
import type { AdoptionRequest } from '../../types/AdoptionRequest';
import Navbar from '../../components/layout/Navbar';
import './AdminAdoptionRequestsPage.css';

export default function AdminAdoptionRequestsPage() {
  const [requests, setRequests] = useState<AdoptionRequest[]>([]);
  const [isAdmin, setIsAdmin] = useState(true);
  const [loggedIn, setLoggedIn] = useState(true);
  const [loadingIds, setLoadingIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await getAdminAdoptionRequests();
        setRequests(data);
      } catch (error) {
        if (error instanceof Error && error.message === 'NOT_LOGGED_IN') {
          setLoggedIn(false);
        } else if (error instanceof Error && error.message === 'USER_NOT_ADMIN') {
          setIsAdmin(false);
        } else {
          console.error('Adoption requests fetch failed', error);
        }
      }
    };

    fetchRequests();
  }, []);

  const handleApprove = async (id: number) => {
    setLoadingIds((prev) => new Set(prev).add(id));
    try {
      await approveAdoptionRequest(id);
      setRequests((prev) => prev.filter((req) => req.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to approve request');
    } finally {
      setLoadingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleReject = async (id: number) => {
    setLoadingIds((prev) => new Set(prev).add(id));
    try {
      await rejectAdoptionRequest(id);
      setRequests((prev) => prev.filter((req) => req.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to reject request');
    } finally {
      setLoadingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  return (
    <>
      <Navbar />
      <main className="admin-adoption-page">
        <header className="admin-adoption-page__header">
          <h1>Adoption request management</h1>
          <Link to="/admin" className="admin-adoption-page__back-link">
            Back to Admin Dashboard
          </Link>
          {(!isAdmin || !loggedIn) && (
            <p className="admin-adoption-page__empty">
              Please log in as admin to see adoption requests.
            </p>
          )}

          {isAdmin && loggedIn && (
            <p>{requests.length} pending adoption request{requests.length !== 1 ? 's' : ''}</p>
          )}
        </header>

        {isAdmin && loggedIn && (
          <>
            {requests.length === 0 ? (
              <p className="admin-adoption-page__empty">No pending adoption requests.</p>
            ) : (
              <section className="admin-adoption-page__grid" aria-label="Adoption request cards">
                {requests.map((req) => {
                  const animalType = req.animal_type?.toLowerCase() || 'other';
                  const isLoading = loadingIds.has(req.id);

                  return (
                    <article key={req.id} className="admin-adoption-card">
                      <div className="admin-adoption-card__header">
                        <span className="admin-adoption-card__animal-name">{req.animal_name}</span>
                        <span className={`admin-adoption-card__animal-type admin-adoption-card__animal-type--${animalType}`}>
                          {animalType}
                        </span>
                      </div>
                      <div className="admin-adoption-card__details">
                        <span>Requested by: <strong>{req.user_name}</strong></span>
                        <span>Submitted: {new Date(req.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="admin-adoption-card__actions">
                        <button
                          type="button"
                          className="admin-adoption-card__approve-btn"
                          onClick={() => handleApprove(req.id)}
                          disabled={isLoading}
                        >
                          {isLoading ? 'Processing...' : 'Approve'}
                        </button>
                        <button
                          type="button"
                          className="admin-adoption-card__reject-btn"
                          onClick={() => handleReject(req.id)}
                          disabled={isLoading}
                        >
                          {isLoading ? 'Processing...' : 'Reject'}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </section>
            )}
          </>
        )}
      </main>
    </>
  );
}
