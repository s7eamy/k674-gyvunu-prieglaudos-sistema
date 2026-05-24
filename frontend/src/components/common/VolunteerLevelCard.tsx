import { useTranslation } from 'react-i18next';
import type { VolunteerLevel } from '../../types/VolunteerLevel';
import './VolunteerLevelCard.css';

type VolunteerLevelCardProps = {
  volunteerLevel: VolunteerLevel;
};

function VolunteerLevelCard({ volunteerLevel }: VolunteerLevelCardProps) {
  const { t } = useTranslation('volunteer');
  return (
    <div className="volunteer-level">
      <div className="volunteer-level__info">
        <span className="volunteer-level__badge">{t('level.badge', { level: volunteerLevel.level })}</span>
        <span className="volunteer-level__completed">
          {t('level.completed', { count: volunteerLevel.completed_count })}
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
          {t('level.nextThreshold', { count: volunteerLevel.next_threshold })}
        </p>
      ) : (
        <p className="volunteer-level__next">{t('level.maxLevel')}</p>
      )}
    </div>
  );
}

export default VolunteerLevelCard;
