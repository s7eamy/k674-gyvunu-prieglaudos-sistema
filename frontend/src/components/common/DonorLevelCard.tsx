import type { DonorLevel } from '../../types/DonorLevel';
import './DonorLevelCard.css';

type DonorLevelCardProps = {
  donorLevel: DonorLevel;
};

const DONOR_LEVELS = [
  { level: 1, name: 'Beginner', emoji: '🌱' },
  { level: 2, name: 'Supporter', emoji: '🤝' },
  { level: 3, name: 'Advocate', emoji: '💪' },
  { level: 4, name: 'Champion', emoji: '⭐' },
  { level: 5, name: 'Platinum Supporter', emoji: '💎' },
];

function DonorLevelCard({ donorLevel }: DonorLevelCardProps) {
  const currentLevelInfo = DONOR_LEVELS.find((l) => l.level === donorLevel.level) || DONOR_LEVELS[0];
  const progressPercentage = donorLevel.next_threshold
    ? Math.min(
        100,
        ((donorLevel.total_points % (donorLevel.next_threshold || 1)) / (donorLevel.next_threshold || 1)) * 100
      )
    : 100;

  return (
    <div className="donor-level">
      <div className="donor-level__info">
        <span className="donor-level__badge">
          {currentLevelInfo.emoji} {currentLevelInfo.name}
        </span>
        <span className="donor-level__points">
          {donorLevel.total_points} point{donorLevel.total_points !== 1 ? 's' : ''} earned
        </span>
      </div>
      
      <div className="donor-level__progress-container">
        <div className="donor-level__progress-bar">
          <div
            className="donor-level__progress-fill"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <span className="donor-level__progress-label">
          {donorLevel.next_threshold
            ? `${donorLevel.points_to_next_level} points to next level`
            : 'Max level reached! 🎉'}
        </span>
      </div>

      {/* Donation points explanation */}
      <div className="donor-level__explanation">
        <h4>How to earn points:</h4>
        <div className="donor-level__points-breakdown">
          <div className="points-item">
            <span className="points-icon">💝</span>
            <span className="points-text">€1 donated = 1 point</span>
          </div>
          <div className="points-item">
            <span className="points-icon"></span>
            <span className="points-text">Volunteering also progresses your supporter bar!</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DonorLevelCard;
