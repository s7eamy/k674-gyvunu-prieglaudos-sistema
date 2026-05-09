import Navbar from '../../components/layout/Navbar';
import AdminShortcutCard from '../../components/common/AdminShortcutCard';
import './AdminDashboardPage.css';

const adminShortcuts = [
  {
    title: 'Volunteer registration management',
    description: 'Review volunteer shift requests, approvals, and attendance updates.',
    to: '/admin/volunteer-registrations',
    icon: '📄',
    badge: 'Active',
    actionLabel: 'Manage registrations',
  },
  {
    title: 'Post creation',
    description: 'Publish shelter updates, stories, and announcements for visitors.',
    to: '/admin/post-creation',
    icon: '✍️',
    badge: 'Active',
    actionLabel: 'Create a post',
  },
  {
    title: 'Adoption request management',
    description: 'Review and approve or reject animal adoption requests from users.',
    to: '/admin/adoption-requests',
    icon: '🏠',
    badge: 'Active',
    actionLabel: 'Manage adoptions',
  },
  {
    title: 'Animal management',
    description: 'Add new dogs, cats, and other animals to the shelter listings.',
    to: '/admin/add-animal',
    icon: '🐾',
    badge: 'Active',
    actionLabel: 'Add an animal',
  },
  {
    title: 'Merchandise management',
    description: 'Prepare merchandise listings and keep store content up to date.',
    to: '/admin/merchandise',
    icon: '🎽',
    badge: 'Soon',
    actionLabel: 'Open placeholder',
  },
  {
    title: 'Donation management',
    description: 'Track donation related admin tools and fundraising support tasks.',
    to: '/admin/donations',
    icon: '💝',
    badge: 'Soon',
    actionLabel: 'Open placeholder',
  },
  {
    title: 'User and admin management',
    description: 'Review users and admin access tools from one place.',
    to: '/admin/users',
    icon: '🛡️',
    badge: 'Soon',
    actionLabel: 'Open placeholder',
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
              actionLabel={shortcut.actionLabel}
            />
          ))}
        </section>
      </main>
    </>
  );
}