import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './AdminShortcutCard.css';

type AdminShortcutCardProps = {
  title: string;
  description: string;
  to: string;
  icon: string;
  badge?: string;
  actionLabel?: string;
};

export default function AdminShortcutCard({
  title,
  description,
  to,
  icon,
  badge,
  actionLabel,
}: AdminShortcutCardProps) {
  const { t } = useTranslation('admin');
  const displayAction = actionLabel ?? t('dashboard.actions.default');
  return (
    <Link to={to} className="admin-shortcut-card">
      <span className="admin-shortcut-card__icon" aria-hidden="true">
        {icon}
      </span>
      <div className="admin-shortcut-card__content">
        <div className="admin-shortcut-card__title-row">
          <h2>{title}</h2>
          {badge && <span className="admin-shortcut-card__badge">{badge}</span>}
        </div>
        <p>{description}</p>
      </div>
      <span className="admin-shortcut-card__action">{displayAction}</span>
    </Link>
  );
}
