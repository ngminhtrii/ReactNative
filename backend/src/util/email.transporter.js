const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server: ', error);
  } else {
    console.log('Email server is ready to take messages');
  }
});

const sendMail = async (email, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_SENDER,
    to: email,
    subject: subject,
    text: text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email: ', error);
  }
};

module.exports = {sendMail};
