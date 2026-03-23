export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const generateOTPExpiry = (minutes = 10) => {
  return new Date(Date.now() + minutes * 60 * 1000);
};