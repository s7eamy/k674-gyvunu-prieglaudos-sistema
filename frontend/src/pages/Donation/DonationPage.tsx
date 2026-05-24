import { useCallback, useEffect, useState, type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Navbar from '../../components/layout/Navbar';
import DonationConfirmationModal from '../../components/common/DonationConfirmationModal';
import DonorLevelCard from '../../components/common/DonorLevelCard';
import { createDonationPaymentIntent, finalizeDonationPayment, getDonorLevel } from '../../services/donorService';
import type { DonorLevel } from '../../types/DonorLevel';
import { useFormatters } from '../../i18n/formatters';
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
  const { t } = useTranslation('donation');
  const { formatCurrency } = useFormatters();
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
    if (!isLoggedIn) return;
    try {
      const level = await getDonorLevel();
      setDonorLevel(level);
    } catch (error) {
      console.error('Failed to fetch donor level', error);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    void fetchDonorLevel();
  }, [fetchDonorLevel]);

  useEffect(() => {
    if (isLoggedIn) {
      const userName = localStorage.getItem('user_name');
      const userEmail = localStorage.getItem('user_email');
      if (userName && userEmail) {
        setFormData((prev) => ({ ...prev, donorName: userName, donorEmail: userEmail }));
      }
    }
  }, [isLoggedIn]);

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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetDonationForm = () => {
    setSelectedAmount(null);
    setCustomAmount('');
    setFormData({ donorName: '', donorEmail: '', message: '' });
    setIsAnonymous(false);
    setPaymentError('');
    setPageError('');
  };

  const handleDonate = async () => {
    const amount = selectedAmount || parseFloat(customAmount);

    if (!amount || amount <= 0) {
      setPageError(t('errors.invalidAmount'));
      return;
    }

    if (!isAnonymous) {
      if (!formData.donorName.trim()) {
        setPageError(t('errors.missingName'));
        return;
      }
      if (!formData.donorEmail.trim()) {
        setPageError(t('errors.missingEmail'));
        return;
      }
      if (!EMAIL_PATTERN.test(formData.donorEmail.trim())) {
        setPageError(t('errors.invalidEmail'));
        return;
      }
    }

    if (!stripe || !elements) {
      setPageError(t('errors.stripeLoading'));
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setPageError(t('errors.cardNotReady'));
      return;
    }

    setIsSubmitting(true);
    setPaymentError('');
    setPageError('');

    try {
      // Canonical English value sent to backend; UI shows translated label via t('anonymous').
      const ANONYMOUS_BACKEND_VALUE = 'Anonymous';
      const response = await createDonationPaymentIntent({
        amount,
        donorName: isAnonymous ? ANONYMOUS_BACKEND_VALUE : formData.donorName.trim(),
        donorEmail: isAnonymous ? '' : formData.donorEmail.trim(),
        message: formData.message.trim(),
        isAnonymous,
      });

      const { error, paymentIntent } = await stripe.confirmCardPayment(response.client_secret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: isAnonymous ? ANONYMOUS_BACKEND_VALUE : formData.donorName.trim(),
            email: isAnonymous ? undefined : formData.donorEmail.trim(),
          },
        },
      });

      if (error) {
        setPaymentError(error.message || t('errors.paymentFailed'));
        return;
      }

      if (paymentIntent?.status === 'succeeded') {
        if (!paymentIntent.id) {
          setPaymentError(t('errors.paymentMissingId'));
          return;
        }

        const finalizedDonation = await finalizeDonationPayment(paymentIntent.id);
        const pointsAwarded = finalizedDonation.donation.points_awarded;

        if (isLoggedIn && finalizedDonation.donor_level) {
          setDonorLevel(finalizedDonation.donor_level);
        }

        setDonationData({
          amount,
          donorName: isAnonymous ? '' : formData.donorName.trim(),
          donorEmail: isAnonymous ? '' : formData.donorEmail.trim(),
          message: formData.message.trim(),
          pointsAwarded,
        });
        setShowConfirmation(true);
        return;
      }

      setPaymentError(t('errors.paymentUnknownStatus', { status: paymentIntent?.status || 'unknown' }));
    } catch (error) {
      console.error('Donation payment failed', error);
      setPaymentError(t('errors.paymentStart'));
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
        '::placeholder': { color: '#8a7060' },
      },
      invalid: { color: '#b91c1c', iconColor: '#b91c1c' },
    },
  };

  return (
    <>
      <Navbar />

      <section className="donation-page__hero">
        <div className="donation-page__hero-content">
          <h1>{t('hero.title')}</h1>
          <p>{t('hero.subtitle')}</p>

          <div className="donation-page__stats">
            <div className="stat-item">
              <span className="stat-number">1,250</span>
              <span className="stat-label">{t('hero.stats.helped')}</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">€45K</span>
              <span className="stat-label">{t('hero.stats.raised')}</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">98%</span>
              <span className="stat-label">{t('hero.stats.care')}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="donation-page">
        <div className="donation-page__container">
          <div className="donation-page__section">
            <h2>{t('step1.title')}</h2>

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
              <span>{t('step1.or')}</span>
            </div>

            <div className="donation-page__custom">
              <label htmlFor="custom-amount">{t('step1.customLabel')}</label>
              <input
                id="custom-amount"
                type="number"
                min="0.01"
                step="0.01"
                placeholder={t('step1.customPlaceholder')}
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
                <p>{t('step1.loginPrompt')}</p>
              </div>
            )}

            {totalAmount > 0 && (
              <div className="donation-page__selected">
                <span>{t('step1.selected')}</span>
                <strong>{formatCurrency(totalAmount)}</strong>
              </div>
            )}
          </div>

          <div className="donation-page__section">
            <h2>{t('step2.title')}</h2>
            <p className="donation-page__info-text">{t('step2.subtitle')}</p>

            {!isAnonymous ? (
              <>
                <div className="donation-page__form-group">
                  <label htmlFor="donor-name">{t('step2.nameLabel')}</label>
                  <input
                    id="donor-name"
                    type="text"
                    name="donorName"
                    value={formData.donorName}
                    onChange={handleInputChange}
                    placeholder={t('step2.namePlaceholder')}
                  />
                </div>

                <div className="donation-page__form-group">
                  <label htmlFor="donor-email">{t('step2.emailLabel')}</label>
                  <input
                    id="donor-email"
                    type="email"
                    name="donorEmail"
                    value={formData.donorEmail}
                    onChange={handleInputChange}
                    placeholder={t('step2.emailPlaceholder')}
                  />
                </div>
              </>
            ) : (
              <div className="donation-page__anonymous-info">
                <p>{t('step2.anonymousNote')}</p>
              </div>
            )}

            <div className="donation-page__form-group">
              <label htmlFor="message">{t('step2.messageLabel')}</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder={t('step2.messagePlaceholder')}
                rows={4}
              />
            </div>

            <div className="donation-page__form-group">
              <label htmlFor="card-element">{t('step2.cardLabel')}</label>
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
                {t('step2.donateAnonymously')}
              </button>
            ) : (
              <button
                type="button"
                className="donation-page__anonymous-btn donation-page__anonymous-btn--active"
                onClick={() => setIsAnonymous(false)}
              >
                {t('step2.provideInfo')}
              </button>
            )}

            <div className="donation-page__impact">
              <h3>{t('impact.title')}</h3>
              <ul>
                <li>{t('impact.item1')}</li>
                <li>{t('impact.item2')}</li>
                <li>{t('impact.item3')}</li>
                <li>{t('impact.item4')}</li>
                <li>{t('impact.item5')}</li>
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
                ? t('cta.processing')
                : totalAmount > 0
                  ? t('cta.donate', { amount: formatCurrency(totalAmount) })
                  : t('cta.selectAmount')}
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
  const { t, i18n } = useTranslation('donation');
  const stripeLocale = i18n.language.startsWith('lt') ? 'lt' : 'en';

  if (!stripePublishableKey) {
    return (
      <>
        <Navbar />
        <div className="donation-page">
          <div className="donation-page__header">
            <h1>{t('notConfiguredTitle')}</h1>
            <p>{t('notConfigured')}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ locale: stripeLocale }} key={stripeLocale}>
      <DonationPageContent />
    </Elements>
  );
}
