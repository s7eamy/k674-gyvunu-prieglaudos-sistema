import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import './AdminFeaturePlaceholderPage.css';

type AdminFeaturePlaceholderPageProps = {
  title: string;
  description: string;
  note: string;
  backTo?: string;
  backLabel?: string;
};

export default function AdminFeaturePlaceholderPage({
  title,
  description,
  note,
  backTo = '/admin',
  backLabel = 'Back to Admin Dashboard',
}: AdminFeaturePlaceholderPageProps) {
  return (
    <>
      <Navbar />
      <main className="admin-feature-page">
        <section className="admin-feature-page__card">
          <p className="admin-feature-page__eyebrow">Admin tools</p>
          <h1>{title}</h1>
          <p className="admin-feature-page__description">{description}</p>
          <p className="admin-feature-page__note">{note}</p>
          <Link to={backTo} className="admin-feature-page__button">
            {backLabel}
          </Link>
        </section>
      </main>
    </>
  );
}