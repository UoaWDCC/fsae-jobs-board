import path from 'path';

export const EMAIL_VERIFICATION_TEMPLATE_PATH = path.join(
  __dirname,
  '../../public/email-verification.html'
);

export const PASSWORD_RESET_TEMPLATE_PATH = path.join(
  __dirname,
  '../../public/password-reset.html'
);

export const SENDER_EMAIL = 'delivered@resend.dev'; // TODO: replace with verified domain later

export const PASSWORD_RESET_LINK = 'http://localhost:5173/reset-password/' // TODO: replace with verified domain later