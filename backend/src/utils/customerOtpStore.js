// In-memory OTP store for reseller customer email verification
// Each entry: email -> { otp, expires }
const store = new Map();

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function setOtp(email) {
  const otp     = generateOtp();
  const expires = Date.now() + 10 * 60 * 1000; // 10 minutes
  store.set(email.toLowerCase(), { otp, expires });
  return otp;
}

function verifyAndClear(email, otp) {
  const key   = email.toLowerCase();
  const entry = store.get(key);

  if (!entry) {
    return { valid: false, message: "No verification code found. Please request a new one." };
  }
  if (Date.now() > entry.expires) {
    store.delete(key);
    return { valid: false, message: "Verification code has expired. Please request a new one." };
  }
  if (entry.otp !== String(otp).trim()) {
    return { valid: false, message: "Invalid code. Please check and try again." };
  }

  store.delete(key);
  return { valid: true };
}

module.exports = { setOtp, verifyAndClear };
