import { useTranslation } from 'react-i18next';
import type { DonorLevel } from '../../types/DonorLevel';
import './DonorLevelCard.css';

type DonorLevelCardProps = {
  donorLevel: DonorLevel;
};

const DONOR_LEVEL_EMOJI: Record<number, string> = {
  1: '🌱',
  2: '🤝',
  3: '💪',
  4: '⭐',
  5: '💎',
};

function DonorLevelCard({ donorLevel }: DonorLevelCardProps) {
  const { t } = useTranslation('donation');
  const emoji = DONOR_LEVEL_EMOJI[donorLevel.level] || '🌱';
  const levelName = t(`level.names.${donorLevel.level}` as never, { defaultValue: '' });

  const progressPercentage = donorLevel.next_threshold
    ? Math.min(
        100,
        ((donorLevel.total_points % (donorLevel.next_threshold || 1)) / (donorLevel.next_threshold || 1)) * 100,
      )
    : 100;

  return (
    <div className="donor-level">
      <div className="donor-level__info">
        <span className="donor-level__badge">
          {emoji} {levelName}
        </span>
        <span className="donor-level__points">
          {t('level.points', { count: donorLevel.total_points })}
        </span>
      </div>

      <div className="donor-level__progress-container">
        <div className="donor-level__progress-bar">
          <div className="donor-level__progress-fill" style={{ width: `${progressPercentage}%` }} />
        </div>
        <span className="donor-level__progress-label">
          {donorLevel.next_threshold
            ? t('level.pointsToNext', { count: donorLevel.points_to_next_level })
            : t('level.maxLevel')}
        </span>
      </div>

      <div className="donor-level__explanation">
        <h4>{t('level.explanation')}</h4>
        <div className="donor-level__points-breakdown">
          <div className="points-item">
            <span className="points-icon">💝</span>
            <span className="points-text">{t('level.rule1')}</span>
          </div>
          <div className="points-item">
            <span className="points-icon"></span>
            <span className="points-text">{t('level.rule2')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DonorLevelCard;
