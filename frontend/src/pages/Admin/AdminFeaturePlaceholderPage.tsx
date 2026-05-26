import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/layout/Navbar';
import './AdminFeaturePlaceholderPage.css';

type AdminFeaturePlaceholderPageProps = {
  keyPrefix: 'merchandise' | 'donations' | 'users' | 'notFound';
  backTo?: string;
};

export default function AdminFeaturePlaceholderPage({
  keyPrefix,
  backTo = '/admin',
}: AdminFeaturePlaceholderPageProps) {
  const { t } = useTranslation('admin');
  return (
    <>
      <Navbar />
      <main className="admin-feature-page">
        <section className="admin-feature-page__card">
          <p className="admin-feature-page__eyebrow">{t('placeholder.eyebrow')}</p>
          <h1>{t(`placeholder.${keyPrefix}.title` as never)}</h1>
          <p className="admin-feature-page__description">{t(`placeholder.${keyPrefix}.description` as never)}</p>
          <p className="admin-feature-page__status">{t('placeholder.status')}</p>
          <p className="admin-feature-page__note">{t(`placeholder.${keyPrefix}.note` as never)}</p>
          <Link to={backTo} className="admin-feature-page__button">
            {t('backLink')}
          </Link>
        </section>
      </main>
    </>
  );
}
