// Donation Confirmation Modal
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

export default function DonationConfirmationModal({
  donation,
  onClose,
}: DonationConfirmationModalProps) {
  const donorName = donation.donorName || 'Anonymous';

  return (
    <div className="modal-overlay">
      <div className="donation-confirmation-modal">
        <div className="donation-confirmation__header">
          <h2>🎉 Thank You!</h2>
          <p>Your donation was processed successfully</p>
        </div>

        <div className="donation-confirmation__content">
          <div className="donation-confirmation__amount">
            <span className="label">Donation Amount</span>
            <span className="value">€{donation.amount.toFixed(2)}</span>
          </div>

          <div className="donation-confirmation__details">
            <div className="detail-row">
              <span className="detail-label">Name:</span>
              <span className="detail-value">{donorName}</span>
            </div>
            {donation.donorEmail && (
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{donation.donorEmail}</span>
              </div>
            )}
            {donation.pointsAwarded && (
              <div className="detail-row">
                <span className="detail-label">Points Earned:</span>
                <span className="detail-value detail-value--points">⭐ {donation.pointsAwarded} points</span>
              </div>
            )}
            {donation.message && (
              <div className="detail-row detail-row--full">
                <span className="detail-label">Message:</span>
                <span className="detail-value">{donation.message}</span>
              </div>
            )}
          </div>

          <div className="donation-confirmation__message">
            {donation.donorEmail ? (
              <p>
                We captured the receipt email <strong>{donation.donorEmail}</strong> for this donation.
              </p>
            ) : (
              <p>This donation was submitted anonymously.</p>
            )}
            <p>
              Thank you for your support! Your donation will directly help us care for animals
              in our shelter.
            </p>
          </div>

          <div className="donation-confirmation__actions">
            <button className="btn-primary" onClick={onClose}>
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
