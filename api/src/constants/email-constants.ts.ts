import path from 'path';

export const EMAIL_VERIFICATION_TEMPLATE_PATH = path.join(
  __dirname,
  '../email-templates/email-verification.html'
);

export const SENDER_EMAIL = 'delivered@resend.dev'; // TODO: replace with verified domain later
