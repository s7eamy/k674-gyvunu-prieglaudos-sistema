import { useTranslation } from 'react-i18next';
import type { VolunteerRegistration } from '../../types/VolunteerRegistration';
import { useFormatters } from '../../i18n/formatters';
import './VolunteerRegistrationCard.css';

type VolunteerRegistrationCardProps = {
  volunteerRegistration: VolunteerRegistration;
  onAbout: (volunteerRegistration: VolunteerRegistration) => void;
};

const getStatusClass = (approved: boolean, attended: boolean) => {
  if (!approved) return 'volunteer-card__tag--pending';
  if (approved && !attended) return 'volunteer-card__tag--approved';
  return 'volunteer-card__tag--attended';
};

function VolunteerRegistrationCard({ volunteerRegistration, onAbout }: VolunteerRegistrationCardProps) {
  const { t } = useTranslation('volunteer');
  const { formatDate } = useFormatters();

  const statusKey = !volunteerRegistration.approved
    ? 'pending'
    : volunteerRegistration.attended
      ? 'attended'
      : 'approved';

  return (
    <article className="volunteer-card" aria-label={t('card.aria')}>
      <div className="volunteer-card__media">
        <span className="volunteer-card__emoji" aria-hidden="true">✍️</span>
      </div>

      <div className="volunteer-card__body">
        <header className="volunteer-card__header">
          <h3 className="volunteer-card__date">{formatDate(volunteerRegistration.date)}</h3>

          <span className={`volunteer-card__tag ${getStatusClass(volunteerRegistration.approved, volunteerRegistration.attended)}`}>
            {t(`modal.status.${statusKey}` as never)}
          </span>
        </header>

        <p className="volunteer-card__time">
          {volunteerRegistration.time_from} — {volunteerRegistration.time_to}
        </p>

        <div className="volunteer-card__tags">
          {volunteerRegistration.approved ? (
            <span className="volunteer-card__tag volunteer-card__tag--approved">{t('card.approved')}</span>
          ) : (
            <span className="volunteer-card__tag volunteer-card__tag--pending">{t('card.waiting')}</span>
          )}

          {volunteerRegistration.attended ? (
            <span className="volunteer-card__tag volunteer-card__tag--attended">{t('card.attended')}</span>
          ) : null}
        </div>

        <button
          type="button"
          className="volunteer-card__details-btn"
          onClick={() => onAbout(volunteerRegistration)}
        >
          {t('card.viewDetails')}
        </button>
      </div>
    </article>
  );
}

export default VolunteerRegistrationCard;
