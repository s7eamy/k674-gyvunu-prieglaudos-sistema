import { useTranslation } from 'react-i18next';
import type { VolunteerRegistration } from '../../types/VolunteerRegistration';
import { approveRegistration, markAttendanceRegistration } from '../../services/adminService';
import { useFormatters } from '../../i18n/formatters';
import './VolunteerRegistrationCard.css';

type AdminRegistrationCardProps = {
  volunteerRegistration: VolunteerRegistration;
  onAbout: (volunteerRegistration: VolunteerRegistration) => void;
  onUpdate: (updatedReg: VolunteerRegistration) => void;
};

const getStatusClass = (approved: boolean, attended: boolean) => {
  if (!approved) return 'volunteer-card__tag--pending';
  if (approved && !attended) return 'volunteer-card__tag--approved';
  return 'volunteer-card__tag--attended';
};

function AdminRegistrationCard({ volunteerRegistration, onAbout, onUpdate }: AdminRegistrationCardProps) {
  const { t } = useTranslation(['admin', 'volunteer']);
  const { formatDate } = useFormatters();

  const statusKey = !volunteerRegistration.approved
    ? 'pending'
    : volunteerRegistration.attended
      ? 'attended'
      : 'approved';

  const handleApprove = async () => {
    try {
      const updatedData = await approveRegistration(volunteerRegistration.id);
      onUpdate(updatedData);
    } catch (error) {
      alert(t('admin:volunteer.approveFail'));
      console.error('Error approving registration', error);
    }
  };

  const handleAttendance = async () => {
    try {
      const updatedData = await markAttendanceRegistration(
        volunteerRegistration.id,
        volunteerRegistration.user_id,
      );
      onUpdate(updatedData);
    } catch (error) {
      alert(t('admin:volunteer.attendanceFail'));
      console.error('Error marking attendance:', error);
    }
  };

  return (
    <article className="volunteer-card" aria-label={t('volunteer:card.aria')}>
      <div className="volunteer-card__media">
        <span className="volunteer-card__emoji" aria-hidden="true">✍️</span>
      </div>

      <div className="volunteer-card__body">
        <header className="volunteer-card__header">
          <h3 className="volunteer-card__date">{formatDate(volunteerRegistration.date)}</h3>

          <span className={`volunteer-card__tag ${getStatusClass(volunteerRegistration.approved, volunteerRegistration.attended)}`}>
            {t(`volunteer:modal.status.${statusKey}` as never)}
          </span>
        </header>

        <p className="volunteer-card__time">
          {volunteerRegistration.time_from} — {volunteerRegistration.time_to}
        </p>

        <div className="volunteer-card__tags">
          {volunteerRegistration.approved ? (
            <span className="volunteer-card__tag volunteer-card__tag--approved">{t('volunteer:card.approved')}</span>
          ) : (
            <span className="volunteer-card__tag volunteer-card__tag--pending">{t('volunteer:card.waiting')}</span>
          )}

          {volunteerRegistration.attended ? (
            <span className="volunteer-card__tag volunteer-card__tag--attended">{t('volunteer:card.attended')}</span>
          ) : null}
        </div>

        <button
          type="button"
          className="volunteer-card__details-btn"
          onClick={() => onAbout(volunteerRegistration)}
        >
          {t('volunteer:card.viewDetails')}
        </button>

        <button
          type="button"
          className="volunteer-card__details-btn"
          onClick={handleApprove}
        >
          {t('admin:volunteer.approve')}
        </button>

        <button
          type="button"
          className="volunteer-card__details-btn"
          onClick={handleAttendance}
        >
          {t('admin:volunteer.markAttendance')}
        </button>
      </div>
    </article>
  );
}

export default AdminRegistrationCard;
