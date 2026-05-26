import { Trans, useTranslation } from 'react-i18next';
import { useFormatters } from '../../i18n/formatters';

interface DonationConfirmationModalProps {
  donation: {
    amount: number;
    donorName: string;
    donorEmail: string;
    message: string;
    pointsAwarded?: number;
  };
  onClose: () => void;
}

export default function DonationConfirmationModal({ donation, onClose }: DonationConfirmationModalProps) {
  const { t } = useTranslation('donation');
  const { formatCurrency } = useFormatters();
  const donorName = donation.donorName || t('anonymous');

  return (
    <div className="modal-overlay">
      <div className="donation-confirmation-modal">
        <div className="donation-confirmation__header">
          <h2>{t('confirmation.title')}</h2>
          <p>{t('confirmation.subtitle')}</p>
        </div>

        <div className="donation-confirmation__content">
          <div className="donation-confirmation__amount">
            <span className="label">{t('confirmation.amountLabel')}</span>
            <span className="value">{formatCurrency(donation.amount)}</span>
          </div>

          <div className="donation-confirmation__details">
            <div className="detail-row">
              <span className="detail-label">{t('confirmation.nameLabel')}</span>
              <span className="detail-value">{donorName}</span>
            </div>
            {donation.donorEmail && (
              <div className="detail-row">
                <span className="detail-label">{t('confirmation.emailLabel')}</span>
                <span className="detail-value">{donation.donorEmail}</span>
              </div>
            )}
            {donation.pointsAwarded ? (
              <div className="detail-row">
                <span className="detail-label">{t('confirmation.pointsLabel')}</span>
                <span className="detail-value detail-value--points">
                  {t('confirmation.pointsValue', { count: donation.pointsAwarded })}
                </span>
              </div>
            ) : null}
            {donation.message && (
              <div className="detail-row detail-row--full">
                <span className="detail-label">{t('confirmation.messageLabel')}</span>
                <span className="detail-value">{donation.message}</span>
              </div>
            )}
          </div>

          <div className="donation-confirmation__message">
            {donation.donorEmail ? (
              <p>
                <Trans i18nKey="confirmation.receipt" t={t} values={{ email: donation.donorEmail }}>
                  We captured the receipt email <strong>{donation.donorEmail}</strong> for this donation.
                </Trans>
              </p>
            ) : (
              <p>{t('confirmation.anonymousNote')}</p>
            )}
            <p>{t('confirmation.thanks')}</p>
          </div>

          <div className="donation-confirmation__actions">
            <button className="btn-primary" onClick={onClose}>
              {t('confirmation.done')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
