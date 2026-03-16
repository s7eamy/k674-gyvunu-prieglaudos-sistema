import type { VolunteerLevel } from '../../types/VolunteerLevel';
import './VolunteerLevelCard.css';

type VolunteerLevelCardProps = {
  volunteerLevel: VolunteerLevel;
};

function VolunteerLevelCard({ volunteerLevel }: VolunteerLevelCardProps) {
  return (
    <div className="volunteer-level">
      <div className="volunteer-level__info">
        <span className="volunteer-level__badge">Level {volunteerLevel.level}</span>
        <span className="volunteer-level__completed">
          {volunteerLevel.completed_count} volunteering{volunteerLevel.completed_count !== 1 ? 's' : ''} completed
        </span>
      </div>
      <div className="volunteer-level__bar-container">
        {Array.from({ length: volunteerLevel.max_level }, (_, i) => (
          <div
            key={i}
            className={`volunteer-level__bar-segment ${i < volunteerLevel.level ? 'volunteer-level__bar-segment--filled' : ''}`}
          />
        ))}
      </div>
      {volunteerLevel.next_threshold !== null ? (
        <p className="volunteer-level__next">
          Next level at {volunteerLevel.next_threshold} completed volunteerings
        </p>
      ) : (
        <p className="volunteer-level__next">Max level reached!</p>
      )}
    </div>
  );
}

export default VolunteerLevelCard;
