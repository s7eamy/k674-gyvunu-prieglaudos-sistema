// Donation page — users can make donations to support the shelter
import { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import DonationConfirmationModal from '../../components/common/DonationConfirmationModal';
import DonorLevelCard from '../../components/common/DonorLevelCard';
import { getDonorLevel } from '../../services/donorService';
import type { DonorLevel } from '../../types/DonorLevel';
import './DonationPage.css';

const PREDEFINED_AMOUNTS = [5, 10, 20, 50, 100];

export default function DonationPage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [donorLevel, setDonorLevel] = useState<DonorLevel | null>(null);
  const [isLoggedIn] = useState(Boolean(localStorage.getItem('access_token')));
  const [donationData, setDonationData] = useState<{
    amount: number;
    donorName: string;
    donorEmail: string;
    message: string;
    pointsAwarded?: number;
  } | null>(null);

  const [isAnonymous, setIsAnonymous] = useState(false);
  const [formData, setFormData] = useState({
    donorName: '',
    donorEmail: '',
    message: '',
  });

  // Fetch donor level on mount
  useEffect(() => {
    const fetchDonorLevel = async () => {
      if (isLoggedIn) {
        try {
          const level = await getDonorLevel();
          setDonorLevel(level);
        } catch (error) {
          console.error('Failed to fetch donor level', error);
        }
      }
    };
    fetchDonorLevel();
  }, [isLoggedIn]);

  // Prefill user data from localStorage when logged in
  useEffect(() => {
    if (isLoggedIn) {
      const userName = localStorage.getItem('user_name');
      const userEmail = localStorage.getItem('user_email');
      
      if (userName && userEmail) {
        setFormData((prev) => ({
          ...prev,
          donorName: userName,
          donorEmail: userEmail,
        }));
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDonate = () => {
    const amount = selectedAmount || parseFloat(customAmount);

    if (!amount || amount <= 0) {
      alert('Please select or enter a valid donation amount');
      return;
    }

    if (!isAnonymous) {
      if (!formData.donorName.trim()) {
        alert('Please enter your name');
        return;
      }

      if (!formData.donorEmail.trim()) {
        alert('Please enter your email');
        return;
      }
    }

    // Process donation (for now, just show confirmation)
    const pointsAwarded = Math.floor(amount); // 1 point per €1
    
    setDonationData({
      amount,
      donorName: isAnonymous ? 'Anonymous' : formData.donorName,
      donorEmail: isAnonymous ? '' : formData.donorEmail,
      message: formData.message,
      pointsAwarded,
    });

    setShowConfirmation(true);
  };

  const handleConfirmation = async () => {
    // Reset form
    setSelectedAmount(null);
    setCustomAmount('');
    setFormData({
      donorName: '',
      donorEmail: '',
      message: '',
    });
    setShowConfirmation(false);
    setDonationData(null);

    // Update donor level locally (simulate donation points being added)
    if (isLoggedIn && donorLevel && donationData) {
      const pointsAwarded = donationData.pointsAwarded || 0;
      const newTotalPoints = donorLevel.total_points + pointsAwarded;
      
      // Calculate new level based on points
      const levelThresholds = [0, 100, 250, 500, 1000]; // Cumulative thresholds for levels 1-5
      let newLevel = 1;
      for (let i = levelThresholds.length - 1; i >= 0; i--) {
        if (newTotalPoints >= levelThresholds[i]) {
          newLevel = i + 1;
          break;
        }
      }
      
      const nextThreshold = levelThresholds[Math.min(newLevel, 4)] + (levelThresholds[Math.min(newLevel, 4)] === 0 ? 100 : 150);
      const pointsToNextLevel = Math.max(0, nextThreshold - newTotalPoints);
      
      // Update the donor level state with new values
      setDonorLevel({
        level: newLevel,
        max_level: 5,
        total_points: newTotalPoints,
        points_to_next_level: pointsToNextLevel,
        next_threshold: pointsToNextLevel > 0 ? nextThreshold : 0,
      });
    }
  };

  const totalAmount = selectedAmount || parseFloat(customAmount) || 0;

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
          {/* Left: Amount Selection */}
          <div className="donation-page__section">
            <h2>Step 1: Choose Your Donation Amount</h2>

            {/* Predefined amounts */}
            <div className="donation-amounts">
              {PREDEFINED_AMOUNTS.map((amount) => (
                <button
                  key={amount}
                  className={`amount-button ${
                    selectedAmount === amount ? 'amount-button--active' : ''
                  }`}
                  onClick={() => handlePredefinedAmount(amount)}
                >
                  €{amount}
                </button>
              ))}
            </div>

            <div className="donation-page__divider">
              <span>or</span>
            </div>

            {/* Custom amount */}
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

            {/* Donor Level Progress Bar */}
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

            {/* Display selected amount */}
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
              <>
                <div className="donation-page__anonymous-info">
                  <p>You're donating <strong>anonymously</strong></p>
                </div>
              </>
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

            {!isAnonymous ? (
              <button
                className="donation-page__anonymous-btn"
                onClick={() => setIsAnonymous(true)}
              >
                Donate Anonymously
              </button>
            ) : (
              <button
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

            {/* CTA Button */}
            <button
              className="donation-page__cta"
              onClick={handleDonate}
              disabled={totalAmount <= 0}
            >
              {totalAmount > 0
                ? `Donate €${totalAmount.toFixed(2)}`
                : 'Select an amount to proceed'}
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && donationData && (
        <DonationConfirmationModal
          donation={donationData}
          onClose={handleConfirmation}
        />
      )}
    </>
  );
}
