const nodemailer = require('nodemailer');

// Configure transporter
const createTransporter = async () => {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    console.log('Using Gmail/SMTP from env');
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  } else {
    // Fallback to Ethereal for testing
    const testAccount = await nodemailer.createTestAccount();
    console.log('Using Ethereal Email for testing');
    console.log('Ethereal User:', testAccount.user);
    console.log('Ethereal Pass:', testAccount.pass);
    
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
  }
};

let transporter;

const init = async () => {
  transporter = await createTransporter();
};

init();

exports.sendOtpEmail = async (email, otp) => {
  if (!transporter) await init();

  const info = await transporter.sendMail({
    from: '"Evinza Support" <support@evinza.com>',
    to: email,
    subject: 'Your Login OTP',
    text: `Your OTP for Evinza is: ${otp}. It expires in 10 minutes.`,
    html: `<b>Your OTP for Evinza is: ${otp}</b><br>It expires in 10 minutes.`
  });

  console.log('Message sent: %s', info.messageId);
  if (info.messageId && !process.env.EMAIL_USER) {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
  return info;
};
