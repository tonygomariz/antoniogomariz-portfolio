/**
 * VERCEL SERVERLESS FUNCTION - CONTACT FORM
 * Handles contact form submissions
 *
 * This API endpoint receives form data and can be extended to:
 * - Send emails via SendGrid, Resend, or NodeMailer
 * - Store submissions in a database (MongoDB, PostgreSQL, etc.)
 * - Send notifications to Slack, Discord, etc.
 * - Integrate with CRM systems
 */

// Helper function to validate email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Helper function to sanitize input (prevent XSS)
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000); // Limit length
}

// Main handler function
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed. Only POST requests are accepted.'
    });
  }

  try {
    // Extract form data from request body
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required.'
      });
    }

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(name),
      email: sanitizeInput(email),
      subject: sanitizeInput(subject),
      message: sanitizeInput(message)
    };

    // Validate email format
    if (!isValidEmail(sanitizedData.email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address.'
      });
    }

    // Validate message length
    if (sanitizedData.message.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Message must be at least 10 characters long.'
      });
    }

    // ============================================
    // FUTURE INTEGRATION POINT: EMAIL SERVICE
    // ============================================
    //
    // Option 1: SendGrid
    // ------------------
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    //
    // await sgMail.send({
    //   to: 'your-email@example.com',
    //   from: 'noreply@yourportfolio.com',
    //   subject: `Portfolio Contact: ${sanitizedData.subject}`,
    //   text: `From: ${sanitizedData.name} (${sanitizedData.email})\n\n${sanitizedData.message}`,
    //   html: `
    //     <h2>New Contact Form Submission</h2>
    //     <p><strong>From:</strong> ${sanitizedData.name}</p>
    //     <p><strong>Email:</strong> ${sanitizedData.email}</p>
    //     <p><strong>Subject:</strong> ${sanitizedData.subject}</p>
    //     <p><strong>Message:</strong></p>
    //     <p>${sanitizedData.message.replace(/\n/g, '<br>')}</p>
    //   `
    // });
    //
    // Option 2: Resend (Modern alternative)
    // --------------------------------------
    // import { Resend } from 'resend';
    // const resend = new Resend(process.env.RESEND_API_KEY);
    //
    // await resend.emails.send({
    //   from: 'Portfolio <noreply@yourportfolio.com>',
    //   to: 'your-email@example.com',
    //   subject: `Portfolio Contact: ${sanitizedData.subject}`,
    //   html: `<p>${sanitizedData.message}</p>`
    // });
    //
    // Option 3: NodeMailer (Self-hosted SMTP)
    // ---------------------------------------
    // const nodemailer = require('nodemailer');
    // const transporter = nodemailer.createTransporter({
    //   host: process.env.SMTP_HOST,
    //   port: process.env.SMTP_PORT,
    //   auth: {
    //     user: process.env.SMTP_USER,
    //     pass: process.env.SMTP_PASS
    //   }
    // });
    //
    // await transporter.sendMail({
    //   from: '"Portfolio Contact" <noreply@yourportfolio.com>',
    //   to: 'your-email@example.com',
    //   subject: `Portfolio Contact: ${sanitizedData.subject}`,
    //   text: sanitizedData.message
    // });
    //
    // ============================================
    // FUTURE INTEGRATION POINT: DATABASE STORAGE
    // ============================================
    //
    // Option 1: MongoDB
    // -----------------
    // const { MongoClient } = require('mongodb');
    // const client = new MongoClient(process.env.MONGODB_URI);
    // await client.connect();
    // const db = client.db('portfolio');
    // await db.collection('messages').insertOne({
    //   ...sanitizedData,
    //   timestamp: new Date(),
    //   ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
    // });
    // await client.close();
    //
    // Option 2: PostgreSQL (via Vercel Postgres)
    // ------------------------------------------
    // import { sql } from '@vercel/postgres';
    // await sql`
    //   INSERT INTO contact_messages (name, email, subject, message, created_at)
    //   VALUES (${sanitizedData.name}, ${sanitizedData.email},
    //           ${sanitizedData.subject}, ${sanitizedData.message}, NOW())
    // `;
    //
    // Option 3: Airtable (No-code database)
    // -------------------------------------
    // const Airtable = require('airtable');
    // const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
    //   .base(process.env.AIRTABLE_BASE_ID);
    //
    // await base('Messages').create([{
    //   fields: sanitizedData
    // }]);
    //
    // ============================================

    // For now, just log the data (development only)
    console.log('Contact form submission:', sanitizedData);

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Message received successfully! I will get back to you soon.'
    });

  } catch (error) {
    // Log error for debugging
    console.error('Contact form error:', error);

    // Return error response
    return res.status(500).json({
      success: false,
      message: 'An error occurred while processing your message. Please try again later.'
    });
  }
}

// ============================================
// CONFIGURATION NOTES
// ============================================
//
// To enable email sending, you'll need to:
// 1. Choose an email service provider (SendGrid, Resend, etc.)
// 2. Install the required package: npm install @sendgrid/mail
// 3. Add your API key to Vercel environment variables:
//    - Go to Vercel Dashboard > Your Project > Settings > Environment Variables
//    - Add: SENDGRID_API_KEY=your_api_key_here
// 4. Uncomment the relevant code section above
// 5. Redeploy your project
//
// For database storage:
// 1. Set up your database (MongoDB Atlas, Vercel Postgres, etc.)
// 2. Add connection string to environment variables
// 3. Install required package
// 4. Uncomment the relevant code section
//
// Security Best Practices:
// - Always use environment variables for sensitive data
// - Implement rate limiting for production (e.g., using Upstash Rate Limit)
// - Add CORS headers if needed
// - Consider adding CAPTCHA for spam protection
// - Monitor and log all submissions
