import { useTranslation } from 'react-i18next';
import Navbar from '../../components/layout/Navbar';
import AdminShortcutCard from '../../components/common/AdminShortcutCard';
import './AdminDashboardPage.css';

type ShortcutKey = 'volunteer' | 'post' | 'adoption' | 'animals' | 'merchandise' | 'donations' | 'users';

const SHORTCUTS: { id: ShortcutKey; to: string; icon: string; badge: 'active' | 'soon'; action: string }[] = [
  { id: 'volunteer', to: '/admin/volunteer-registrations', icon: '📄', badge: 'active', action: 'manageRegistrations' },
  { id: 'post', to: '/admin/post-creation', icon: '✍️', badge: 'active', action: 'createPost' },
  { id: 'adoption', to: '/admin/adoption-requests', icon: '🏠', badge: 'active', action: 'manageAdoptions' },
  { id: 'animals', to: '/admin/add-animal', icon: '🐾', badge: 'active', action: 'addAnimal' },
  { id: 'merchandise', to: '/admin/merchandise', icon: '🎽', badge: 'soon', action: 'openPlaceholder' },
  { id: 'donations', to: '/admin/donations', icon: '💝', badge: 'soon', action: 'openPlaceholder' },
  { id: 'users', to: '/admin/users', icon: '🛡️', badge: 'soon', action: 'openPlaceholder' },
];

export default function AdminDashboardPage() {
  const { t } = useTranslation('admin');

  return (
    <>
      <Navbar />
      <main className="admin-dashboard">
        <section className="admin-dashboard__hero">
          <p className="admin-dashboard__eyebrow">{t('dashboard.eyebrow')}</p>
          <h1>{t('dashboard.title')}</h1>
          <p>{t('dashboard.subtitle')}</p>
        </section>

        <section className="admin-dashboard__grid" aria-label={t('dashboard.ariaShortcuts')}>
          {SHORTCUTS.map((shortcut) => (
            <AdminShortcutCard
              key={shortcut.id}
              title={t(`dashboard.shortcuts.${shortcut.id}.title` as never)}
              description={t(`dashboard.shortcuts.${shortcut.id}.description` as never)}
              to={shortcut.to}
              icon={shortcut.icon}
              badge={t(`dashboard.badges.${shortcut.badge}` as never)}
              actionLabel={t(`dashboard.actions.${shortcut.action}` as never)}
            />
          ))}
        </section>
      </main>
    </>
  );
}
