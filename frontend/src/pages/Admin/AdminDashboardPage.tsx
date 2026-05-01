import Navbar from '../../components/layout/Navbar';
import AdminShortcutCard from '../../components/common/AdminShortcutCard';
import './AdminDashboardPage.css';

const adminShortcuts = [
  {
    title: 'Volunteer registrations',
    description: 'Review and manage volunteer shift requests and approvals.',
    to: '/admin/volunteer-registrations',
    icon: '📄',
    badge: 'Active',
  },
  {
    title: 'Create post',
    description: 'Publish shelter updates, stories, and announcements.',
    to: '/admin/post-creation',
    icon: '✍️',
    badge: 'Active',
  },
  {
    title: 'Add animals',
    description: 'Add new dogs, cats, and other animals to the shelter listing.',
    to: '/admin/add-animal',
    icon: '🐾',
    badge: 'Active',
  },
  {
    title: 'Merchandise management',
    description: 'Prepare merchandise listings and keep store content up to date.',
    to: '/admin/merchandise',
    icon: '🎽',
    badge: 'Soon',
  },
  {
    title: 'Donation management',
    description: 'Track donation related admin tools and fundraising support tasks.',
    to: '/admin/donations',
    icon: '💝',
    badge: 'Soon',
  },
  {
    title: 'User / admin management',
    description: 'Review users and admin access related tools from one place.',
    to: '/admin/users',
    icon: '🛡️',
    badge: 'Soon',
  },
];

export default function AdminDashboardPage() {
  return (
    <>
      <Navbar />
      <main className="admin-dashboard">
        <section className="admin-dashboard__hero">
          <p className="admin-dashboard__eyebrow">Admin dashboard</p>
          <h1>Choose a management area</h1>
          <p>
            Use the shortcuts below to jump straight to the admin tools you need.
            The most common workflows are ready now, and the rest are prepared as dashboard links.
          </p>
        </section>

        <section className="admin-dashboard__grid" aria-label="Admin shortcuts">
          {adminShortcuts.map((shortcut) => (
            <AdminShortcutCard
              key={shortcut.title}
              title={shortcut.title}
              description={shortcut.description}
              to={shortcut.to}
              icon={shortcut.icon}
              badge={shortcut.badge}
            />
          ))}
        </section>
      </main>
    </>
  );
}