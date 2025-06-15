require('dotenv').config(); // Load environment variables

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Setup transporter once
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ✅ Your original POST /send-email route
app.post('/send-email', async (req, res) => {
  const { name, email, phone, service, message } = req.body;

  try {
    await transporter.sendMail({
      from: `"Kashish Website" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_RECEIVER,
      subject: `New Inquiry from ${name}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Service:</strong> ${service || 'Not specified'}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    res.status(200).send({ success: true, message: 'Email sent successfully' });
  } catch (err) {
    console.error('❌ Email sending failed:', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});



// ✅ 🔍 Add this test route here
app.get('/test-mail', async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"Test Sender" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_RECEIVER,
      subject: 'Test Email',
      text: 'If you receive this, the server email setup works.',
    });

    res.send('✅ Test email sent!');
  } catch (err) {
    console.error('❌ Test email error:', err); // THIS SHOWS THE REAL PROBLEM
    res.status(500).send('❌ Test email failed.');
  }
});


// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
