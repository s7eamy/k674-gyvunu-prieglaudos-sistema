import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getAdminAdoptionRequests, approveAdoptionRequest, rejectAdoptionRequest } from '../../services/adoptionRequestService';
import type { AdoptionRequest } from '../../types/AdoptionRequest';
import Navbar from '../../components/layout/Navbar';
import { useEnumLabel } from '../../i18n/useEnumLabel';
import { useFormatters } from '../../i18n/formatters';
import { translateApiError } from '../../i18n/errorMap';
import './AdminAdoptionRequestsPage.css';

export default function AdminAdoptionRequestsPage() {
  const { t } = useTranslation('admin');
  const enumLabel = useEnumLabel();
  const { formatDate } = useFormatters();
  const [requests, setRequests] = useState<AdoptionRequest[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loadingIds, setLoadingIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await getAdminAdoptionRequests();
        setRequests(data);
        setLoggedIn(true);
        setIsAdmin(true);
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
      alert(translateApiError(err) || t('adoption.approveFail'));
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
      alert(translateApiError(err) || t('adoption.rejectFail'));
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
          <h1>{t('adoption.title')}</h1>
          <Link to="/admin" className="admin-adoption-page__back-link">
            {t('backLink')}
          </Link>
          {(!isAdmin || !loggedIn) && (
            <p className="admin-adoption-page__empty">{t('adoption.loginPrompt')}</p>
          )}

          {isAdmin && loggedIn && (
            <p>{t('adoption.count', { count: requests.length })}</p>
          )}
        </header>

        {isAdmin && loggedIn && (
          <>
            {requests.length === 0 ? (
              <p className="admin-adoption-page__empty">{t('adoption.empty')}</p>
            ) : (
              <section className="admin-adoption-page__grid" aria-label={t('adoption.ariaGrid')}>
                {requests.map((req) => {
                  const animalType = req.animal_type?.toLowerCase() || 'other';
                  const isLoading = loadingIds.has(req.id);

                  return (
                    <article key={req.id} className="admin-adoption-card">
                      <div className="admin-adoption-card__header">
                        <span className="admin-adoption-card__animal-name">{req.animal_name}</span>
                        <span className={`admin-adoption-card__animal-type admin-adoption-card__animal-type--${animalType}`}>
                          {enumLabel('animal_type', animalType)}
                        </span>
                      </div>
                      <div className="admin-adoption-card__details">
                        <span>
                          {t('adoption.requestedBy')} <strong>{req.user_name}</strong>
                        </span>
                        <span>{t('adoption.submittedDate', { date: formatDate(req.created_at) })}</span>
                      </div>
                      <div className="admin-adoption-card__actions">
                        <button
                          type="button"
                          className="admin-adoption-card__approve-btn"
                          onClick={() => handleApprove(req.id)}
                          disabled={isLoading}
                        >
                          {isLoading ? t('adoption.processing') : t('adoption.approve')}
                        </button>
                        <button
                          type="button"
                          className="admin-adoption-card__reject-btn"
                          onClick={() => handleReject(req.id)}
                          disabled={isLoading}
                        >
                          {isLoading ? t('adoption.processing') : t('adoption.reject')}
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
