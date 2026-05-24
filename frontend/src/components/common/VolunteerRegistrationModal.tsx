import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { VolunteerRegistration } from '../../types/VolunteerRegistration';
import { useFormatters } from '../../i18n/formatters';
import './VolunteerRegistrationModal.css';

type VolunteerRegistrationModalProps = {
  volunteerRegistration: VolunteerRegistration | null;
  onClose: () => void;
};

const TASK_EN_TO_ID: Record<string, string> = {
  'Walk dogs': 'walk_dogs',
  'Feed animals': 'feed_animals',
  'Clean cages': 'clean_cages',
  'Play & socialize': 'play_socialize',
  'Groom animals': 'groom_animals',
  'Photography': 'photography',
  'Event support': 'event_support',
};

function VolunteerRegistrationModal({ volunteerRegistration, onClose }: VolunteerRegistrationModalProps) {
  const { t } = useTranslation('volunteer');
  const { formatDate, formatDateTime } = useFormatters();

  useEffect(() => {
    if (!volunteerRegistration) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [volunteerRegistration, onClose]);

  if (!volunteerRegistration) return null;

  const statusKey = !volunteerRegistration.approved
    ? 'pending'
    : volunteerRegistration.attended
      ? 'attended'
      : 'approved';

  const translateTask = (raw: string): string => {
    const id = TASK_EN_TO_ID[raw];
    if (id) return t(`tasks.${id}` as never);
    return raw;
  };

  return (
    <div className="volunteer-modal__backdrop" role="presentation" onClick={onClose}>
      <div
        className="volunteer-modal"
        role="dialog"
        aria-modal="true"
        aria-label={t('modal.aria')}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="volunteer-modal__close"
          aria-label={t('modal.close')}
          onClick={onClose}
        >
          ✕
        </button>

        <div className="volunteer-modal__hero">
          <span className="volunteer-modal__emoji">✋</span>
        </div>

        <div className="volunteer-modal__content">
          <header className="volunteer-modal__heading">
            <h2>{t('modal.title')}</h2>
            <p>{formatDate(volunteerRegistration.date)}</p>
          </header>

          <section className="volunteer-modal__stats">
            <div className="volunteer-modal__stat-item">
              <span className="volunteer-modal__stat-label">{t('modal.stats.start')}</span>
              <strong>{volunteerRegistration.time_from}</strong>
            </div>

            <div className="volunteer-modal__stat-item">
              <span className="volunteer-modal__stat-label">{t('modal.stats.end')}</span>
              <strong>{volunteerRegistration.time_to}</strong>
            </div>

            <div className="volunteer-modal__stat-item">
              <span className="volunteer-modal__stat-label">{t('modal.stats.status')}</span>
              <strong>{t(`modal.status.${statusKey}` as never)}</strong>
            </div>

            <div className="volunteer-modal__stat-item">
              <span className="volunteer-modal__stat-label">{t('modal.stats.registered')}</span>
              <strong>{formatDateTime(volunteerRegistration.created_at)}</strong>
            </div>
          </section>

          <section className="volunteer-modal__section">
            <h3>{t('modal.sections.tasks')}</h3>

            {volunteerRegistration.tasks.length > 0 ? (
              volunteerRegistration.tasks.map((task, index) => (
                <div key={index} style={{ display: 'inline-block' }}>
                  <span className="volunteer-modal__task">{translateTask(task)}</span>
                </div>
              ))
            ) : (
              <p>{t('modal.sections.tasksEmpty')}</p>
            )}
          </section>

          <section className="volunteer-modal__section">
            <h3>{t('modal.sections.approval')}</h3>
            <p>
              {volunteerRegistration.approved ? t('modal.approval.approved') : t('modal.approval.pending')}
            </p>
          </section>

          <section className="volunteer-modal__section">
            <h3>{t('modal.sections.attendance')}</h3>
            <p>
              {volunteerRegistration.attended ? t('modal.attendance.attended') : t('modal.attendance.pending')}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default VolunteerRegistrationModal;
