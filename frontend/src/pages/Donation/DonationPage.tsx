// Donation page — users can make donations to support the shelter
import { useCallback, useEffect, useState, type ChangeEvent } from 'react';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Navbar from '../../components/layout/Navbar';
import DonationConfirmationModal from '../../components/common/DonationConfirmationModal';
import DonorLevelCard from '../../components/common/DonorLevelCard';
import { createDonationPaymentIntent, finalizeDonationPayment, getDonorLevel } from '../../services/donorService';
import type { DonorLevel } from '../../types/DonorLevel';
import './DonationPage.css';

const PREDEFINED_AMOUNTS = [5, 10, 20, 50, 100];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

type DonationFormState = {
  donorName: string;
  donorEmail: string;
  message: string;
};

type DonationPreview = {
  amount: number;
  donorName: string;
  donorEmail: string;
  message: string;
  pointsAwarded: number;
};

function DonationPageContent() {
  const stripe = useStripe();
  const elements = useElements();

  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [donorLevel, setDonorLevel] = useState<DonorLevel | null>(null);
  const [isLoggedIn] = useState(Boolean(localStorage.getItem('access_token')));
  const [donationData, setDonationData] = useState<DonationPreview | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [formData, setFormData] = useState<DonationFormState>({
    donorName: '',
    donorEmail: '',
    message: '',
  });
  const [paymentError, setPaymentError] = useState('');
  const [pageError, setPageError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDonorLevel = useCallback(async () => {
    if (!isLoggedIn) {
      return;
    }

    try {
      const level = await getDonorLevel();
      setDonorLevel(level);
    } catch (error) {
      console.error('Failed to fetch donor level', error);
    }
  }, [isLoggedIn]);

  // Fetch donor level on mount
  useEffect(() => {
    void fetchDonorLevel();
  }, [fetchDonorLevel]);

  const handlePredefinedAmount = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmount = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetDonationForm = () => {
    setSelectedAmount(null);
    setCustomAmount('');
    setFormData({
      donorName: '',
      donorEmail: '',
      message: '',
    });
    setIsAnonymous(false);
    setPaymentError('');
    setPageError('');
  };

  const handleDonate = async () => {
    const amount = selectedAmount || parseFloat(customAmount);

    if (!amount || amount <= 0) {
      setPageError('Please select or enter a valid donation amount.');
      return;
    }

    if (!isAnonymous) {
      if (!formData.donorName.trim()) {
        setPageError('Please enter your name.');
        return;
      }

      if (!formData.donorEmail.trim()) {
        setPageError('Please enter your email.');
        return;
      }

      if (!EMAIL_PATTERN.test(formData.donorEmail.trim())) {
        setPageError('Please enter a valid email address.');
        return;
      }
    }

    if (!stripe || !elements) {
      setPageError('Stripe is still loading. Please try again in a moment.');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setPageError('Payment form is not ready yet.');
      return;
    }

    setIsSubmitting(true);
    setPaymentError('');
    setPageError('');

    try {
      const response = await createDonationPaymentIntent({
        amount,
        donorName: isAnonymous ? 'Anonymous' : formData.donorName.trim(),
        donorEmail: isAnonymous ? '' : formData.donorEmail.trim(),
        message: formData.message.trim(),
        isAnonymous,
      });

      const { error, paymentIntent } = await stripe.confirmCardPayment(response.client_secret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: isAnonymous ? 'Anonymous donor' : formData.donorName.trim(),
            email: isAnonymous ? undefined : formData.donorEmail.trim(),
          },
        },
      });

      if (error) {
        setPaymentError(error.message || 'Payment failed.');
        return;
      }

      if (paymentIntent?.status === 'succeeded') {
        if (!paymentIntent.id) {
          setPaymentError('Payment succeeded, but confirmation ID is missing.');
          return;
        }

        const finalizedDonation = await finalizeDonationPayment(paymentIntent.id);
        const pointsAwarded = finalizedDonation.donation.points_awarded;

        if (isLoggedIn && finalizedDonation.donor_level) {
          setDonorLevel(finalizedDonation.donor_level);
        }

        setDonationData({
          amount,
          donorName: isAnonymous ? 'Anonymous' : formData.donorName.trim(),
          donorEmail: isAnonymous ? '' : formData.donorEmail.trim(),
          message: formData.message.trim(),
          pointsAwarded,
        });
        setShowConfirmation(true);
        return;
      }

      setPaymentError(`Payment completed with unexpected status: ${paymentIntent?.status || 'unknown'}.`);
    } catch (error) {
      console.error('Donation payment failed', error);
      setPaymentError('Unable to start the donation payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmation = () => {
    setShowConfirmation(false);
    setDonationData(null);
    resetDonationForm();
  };

  const totalAmount = selectedAmount || parseFloat(customAmount) || 0;

  const cardElementOptions = {
    hidePostalCode: true,
    disableLink: true,
    style: {
      base: {
        color: '#2c1a0e',
        fontFamily: 'inherit',
        fontSize: '16px',
        fontSmoothing: 'antialiased',
        iconColor: '#8a7060',
        '::placeholder': {
          color: '#8a7060',
        },
      },
      invalid: {
        color: '#b91c1c',
        iconColor: '#b91c1c',
      },
    },
  };

  return (
    <>
      <Navbar />
      <div className="donation-page">
        <div className="donation-page__header">
          <h1>💝 Support Our Shelter</h1>
          <p>
            Your donation helps us provide food, medical care, and a safe home for animals in need.
            Every contribution makes a real difference.
          </p>
        </div>

        <div className="donation-page__container">
          <div className="donation-page__section">
            <h2>Step 1: Choose Your Donation Amount</h2>

            <div className="donation-amounts">
              {PREDEFINED_AMOUNTS.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  className={`amount-button ${selectedAmount === amount ? 'amount-button--active' : ''}`}
                  onClick={() => handlePredefinedAmount(amount)}
                >
                  €{amount}
                </button>
              ))}
            </div>

            <div className="donation-page__divider">
              <span>or</span>
            </div>

            <div className="donation-page__custom">
              <label htmlFor="custom-amount">Enter a custom amount (€)</label>
              <input
                id="custom-amount"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="e.g., 25.50"
                value={customAmount}
                onChange={(e) => handleCustomAmount(e.target.value)}
              />
            </div>

            {isLoggedIn && donorLevel && (
              <div className="donation-page__donor-level">
                <DonorLevelCard donorLevel={donorLevel} />
              </div>
            )}

            {!isLoggedIn && (
              <div className="donation-page__login-prompt">
                <p>📝 <strong>Log in to track your donor level and earn points!</strong></p>
              </div>
            )}

            {totalAmount > 0 && (
              <div className="donation-page__selected">
                <span>Selected amount:</span>
                <strong>€{totalAmount.toFixed(2)}</strong>
              </div>
            )}
          </div>

          {/* Right: Donor Information */}
          <div className="donation-page__section">
            <h2>Step 2: Your Information</h2>
            <p className="donation-page__info-text">Let us know who you are so we'd know who to thank!</p>

            {!isAnonymous ? (
              <>
                <div className="donation-page__form-group">
                  <label htmlFor="donor-name">Full Name *</label>
                  <input
                    id="donor-name"
                    type="text"
                    name="donorName"
                    value={formData.donorName}
                    onChange={handleInputChange}
                    placeholder="Your name"
                  />
                </div>

                <div className="donation-page__form-group">
                  <label htmlFor="donor-email">Email Address *</label>
                  <input
                    id="donor-email"
                    type="email"
                    name="donorEmail"
                    value={formData.donorEmail}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                  />
                </div>
              </>
            ) : (
              <div className="donation-page__anonymous-info">
                <p>You're donating <strong>anonymously</strong>.</p>
              </div>
            )}

            <div className="donation-page__form-group">
              <label htmlFor="message">Message (Optional)</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Share why you're supporting us..."
                rows={4}
              />
            </div>

            <div className="donation-page__form-group">
              <label htmlFor="card-element">Card Details *</label>
              <div className="donation-page__card-element">
                <CardElement id="card-element" options={cardElementOptions} />
              </div>
            </div>

            {!isAnonymous ? (
              <button
                type="button"
                className="donation-page__anonymous-btn"
                onClick={() => setIsAnonymous(true)}
              >
                Donate Anonymously
              </button>
            ) : (
              <button
                type="button"
                className="donation-page__anonymous-btn donation-page__anonymous-btn--active"
                onClick={() => setIsAnonymous(false)}
              >
                Provide Your Information
              </button>
            )}

            {/* Impact info */}
            <div className="donation-page__impact">
              <h3>Your Impact 🌟</h3>
              <ul>
                <li>€5 provides food for 2 animals for a day</li>
                <li>€10 covers medical supplies for one animal</li>
                <li>€20 helps with shelter utilities</li>
                <li>€50 supports emergency medical care</li>
                <li>€100+ provides comprehensive care for a month</li>
              </ul>
            </div>

            {pageError && <div className="donation-page__error">{pageError}</div>}
            {paymentError && <div className="donation-page__error">{paymentError}</div>}

            <button
              type="button"
              className="donation-page__cta"
              onClick={handleDonate}
              disabled={totalAmount <= 0 || isSubmitting || !stripe || !elements}
            >
              {isSubmitting
                ? 'Processing payment...'
                : totalAmount > 0
                  ? `Donate €${totalAmount.toFixed(2)}`
                  : 'Select an amount to proceed'}
            </button>
          </div>
        </div>
      </div>

      {showConfirmation && donationData && (
        <DonationConfirmationModal donation={donationData} onClose={handleConfirmation} />
      )}
    </>
  );
}

export default function DonationPage() {
  if (!stripePublishableKey) {
    return (
      <>
        <Navbar />
        <div className="donation-page">
          <div className="donation-page__header">
            <h1>💝 Support Our Shelter</h1>
            <p>Stripe is not configured yet. Set VITE_STRIPE_PUBLISHABLE_KEY in the frontend env file.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <DonationPageContent />
    </Elements>
  );
}
