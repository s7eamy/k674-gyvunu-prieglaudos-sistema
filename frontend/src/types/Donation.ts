export interface Donation {
  id: number;
  user_id: number | null;
  donor_name: string;
  donor_email: string | null;
  message: string | null;
  amount_cents: number;
  amount: number;
  currency: string;
  is_anonymous: boolean;
  points_awarded: number;
  payment_status: string;
  stripe_payment_intent_id: string | null;
  created_at: string;
  paid_at: string | null;
  updated_at: string | null;
}

export interface CreateDonationPaymentIntentRequest {
  amount: number;
  donorName: string;
  donorEmail: string;
  message: string;
  isAnonymous: boolean;
}

export interface DonationPaymentIntentResponse {
  donation: Donation;
  client_secret: string;
}

export interface DonationFinalizeRequest {
  paymentIntentId: string;
}

export interface DonationFinalizeResponse {
  donation: Donation;
  donor_level: {
    level: number;
    max_level: number;
    total_points: number;
    points_to_next_level: number;
    next_threshold: number | null;
  } | null;
}