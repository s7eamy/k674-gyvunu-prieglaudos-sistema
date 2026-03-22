import type { VolunteerRegistration } from '../../types/VolunteerRegistration';
import { approveRegistration, markAttendanceRegistration } from '../../services/adminService';
import './VolunteerRegistrationCard.css';

type AdminRegistrationCardProps = {
  volunteerRegistration: VolunteerRegistration;
  onAbout: (volunteerRegistration: VolunteerRegistration) => void;
  onUpdate: (updatedReg: VolunteerRegistration) => void;
};

const formatDate = (date: Date | string) => {
  const d = date instanceof Date ? date : new Date(date);

  if (Number.isNaN(d.getTime())) {
    return 'Unknown';
  }

  return d.toLocaleDateString();
};

const getStatusLabel = (approved: boolean, attended: boolean) => {
  if (!approved) {
    return 'Pending';
  }

  if (approved && !attended) {
    return 'Approved';
  }

  return 'Attended';
};

const getStatusClass = (approved: boolean, attended: boolean) => {
  if (!approved) {
    return 'volunteer-card__tag--pending';
  }

  if (approved && !attended) {
    return 'volunteer-card__tag--approved';
  }

  return 'volunteer-card__tag--attended';
};

function AdminRegistrationCard({
  volunteerRegistration,
  onAbout,
  onUpdate
}: AdminRegistrationCardProps) {

  const status = getStatusLabel(volunteerRegistration.approved, volunteerRegistration.attended);
  
  const handleApprove = async () => {
    try {
      const updatedData = await approveRegistration(volunteerRegistration.id);
      onUpdate(updatedData);
    } catch (error) {
      alert("Failed to approve registration");
    }
  };

  const handleAttendance= async () => {
    try {
      const updatedData = await markAttendanceRegistration(volunteerRegistration.id, volunteerRegistration.user_id);
      onUpdate(updatedData);
    } catch (error) {
      alert("Failed to mark registration attendance");
    }
  };

  return (
    <article className="volunteer-card" aria-label="Volunteer registration card">
      <div className="volunteer-card__media">
        <span className="volunteer-card__emoji" aria-hidden="true">
          ✍️
        </span>
      </div>

      <div className="volunteer-card__body">

        <header className="volunteer-card__header">
          <h3 className="volunteer-card__date">
            {formatDate(volunteerRegistration.date)}
          </h3>

          <span className={`volunteer-card__tag ${getStatusClass(volunteerRegistration.approved, volunteerRegistration.attended)}`}>
            {status}
          </span>
        </header>

        <p className="volunteer-card__time">
          {volunteerRegistration.time_from} — {volunteerRegistration.time_to}
        </p>

        <div className="volunteer-card__tags">
          {volunteerRegistration.approved ? (
            <span className="volunteer-card__tag volunteer-card__tag--approved">
              ✔ approved
            </span>
          ) : (
            <span className="volunteer-card__tag volunteer-card__tag--pending">
              ⏳ waiting approval
            </span>
          )}

          {volunteerRegistration.attended ? (
            <span className="volunteer-card__tag volunteer-card__tag--attended">
              🎉 attended
            </span>
          ) : null}
        </div>

        <button
          type="button"
          className="volunteer-card__details-btn"
          onClick={() =>   onAbout(volunteerRegistration)}
        >
          View Details
        </button>

        <button
          type="button"
          className="volunteer-card__details-btn"
          onClick={handleApprove}
        >
          Approve
        </button>

        <button
          type="button"
          className="volunteer-card__details-btn"
          onClick={handleAttendance}
        >
          Mark Attendance
        </button>

      </div>
    </article>
  );
}

export default AdminRegistrationCard;