/**
 * Input Validators for Banking Forms
 */

export const validateTransferForm = (data, currentBalance) => {
  const errors = {};

  if (!data.recipient || data.recipient.trim() === '') {
    errors.recipient = 'Recipient name/account is required';
  }

  if (!data.amount || isNaN(data.amount) || parseFloat(data.amount) <= 0) {
    errors.amount = 'Enter a valid transfer amount greater than ₹0';
  } else if (parseFloat(data.amount) > currentBalance) {
    errors.amount = `Insufficient funds. Current balance: ₹${currentBalance}`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
