export interface ReferralState {
  totalReferrals: string
  totalReferralCommissions: string
}

export interface ReferralData extends ReferralState {
  setTotalReferrals: (numReferrals: string) => void
  setTotalCommissions: (commissionsEarned: string) => void
}
