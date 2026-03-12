import { useEffect } from 'react';
import type { VolunteerRegistration } from '../../types/VolunteerRegistration';
import './VolunteerRegistrationModal.css';

type VolunteerRegistrationModalProps = {
  volunteerRegistration: VolunteerRegistration | null;
  onClose: () => void;
};

const formatDate = (date: Date | string) => {
  const d = date instanceof Date ? date : new Date(date);

  if (Number.isNaN(d.getTime())) {
    return 'Unknown';
  }

  return d.toLocaleDateString();
};

const formatCreatedDate = (date: Date | string) => {
  const d = date instanceof Date ? date : new Date(date);

  if (Number.isNaN(d.getTime())) {
    return 'Unknown';
  }

  return d.toLocaleString();
};

function VolunteerRegistrationModal({
  volunteerRegistration,
  onClose
}: VolunteerRegistrationModalProps) {

  useEffect(() => {
    if (!volunteerRegistration) {
      return;
    }

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [volunteerRegistration, onClose]);

  if (!volunteerRegistration) {
    return null;
  }

  const status = !volunteerRegistration.approved
    ? 'Pending approval'
    : volunteerRegistration.attended
    ? 'Attended'
    : 'Approved';

  return (
    <div
      className="volunteer-modal__backdrop"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="volunteer-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Volunteer registration details"
        onClick={(event) => event.stopPropagation()}
      >

        <button
          type="button"
          className="volunteer-modal__close"
          aria-label="Close modal"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="volunteer-modal__hero">
          <span className="volunteer-modal__emoji">✋</span>
        </div>

        <div className="volunteer-modal__content">

          <header className="volunteer-modal__heading">
            <h2>Volunteer Shift</h2>
            <p>{formatDate(volunteerRegistration.date)}</p>
          </header>

          <section className="volunteer-modal__stats">

            <div className="volunteer-modal__stat-item">
              <span className="volunteer-modal__stat-label">Start</span>
              <strong>{volunteerRegistration.time_from}</strong>
            </div>

            <div className="volunteer-modal__stat-item">
              <span className="volunteer-modal__stat-label">End</span>
              <strong>{volunteerRegistration.time_to}</strong>
            </div>

            <div className="volunteer-modal__stat-item">
              <span className="volunteer-modal__stat-label">Status</span>
              <strong>{status}</strong>
            </div>

            <div className="volunteer-modal__stat-item">
              <span className="volunteer-modal__stat-label">Registered</span>
              <strong>{formatCreatedDate(volunteerRegistration.created_at)}</strong>
            </div>

          </section>

          <section className="volunteer-modal__section">
            <h3>Approval</h3>
            <p>
              {volunteerRegistration.approved
                ? 'This volunteer shift has been approved by an administrator.'
                : 'Waiting for administrator approval.'}
            </p>
          </section>

          <section className="volunteer-modal__section">
            <h3>Attendance</h3>
            <p>
              {volunteerRegistration.attended
                ? 'Attendance has been confirmed.'
                : 'Attendance has not yet been confirmed.'}
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}

export default VolunteerRegistrationModal;