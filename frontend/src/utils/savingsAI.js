export const generateSavingsInsight =
  (
    balance,
    contributions
  ) => {

    if (
      balance < 5000
    ) {

      return 'Increase your weekly savings by 10% to reach payout goals faster.'

    }

    if (
      contributions > 10
    ) {

      return 'Excellent consistency. You qualify for premium savings groups.'

    }

    return 'Keep saving consistently to unlock higher payouts.'
  }