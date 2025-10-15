import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-8fff4b3c/health", (c) => {
  return c.json({ status: "ok" });
});

// Send email notification when call is completed
app.post("/make-server-8fff4b3c/send-call-notification", async (c) => {
  try {
    const body = await c.req.json();
    const { contactName, contactPhone, company, notes, completedBy, timestamp } = body;

    // Validate required fields
    if (!contactName || !contactPhone) {
      return c.json({ 
        success: false, 
        error: "Missing required fields: contactName and contactPhone are required" 
      }, 400);
    }

    // Fetch email recipients from database
    const recipientsData = await kv.get("email_recipients");
    let recipients = recipientsData?.value?.emails || [
      "operations@btmlimited.net",
      "quantityassurance@btmlimited.net", 
      "clientcare@btmlimited.net"
    ];

    console.log(`[EMAIL] Using ${recipientsData ? 'custom' : 'default'} recipients: ${recipients.join(", ")}`);

    // Create email content
    const emailSubject = `Call Completed: ${contactName} - BTMTravel CRM`;
    const emailBody = `
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px;">
    <div style="background: white; padding: 30px; border-radius: 8px;">
      <h2 style="color: #667eea; margin-top: 0;">✅ Call Completed - BTMTravel CRM</h2>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #333;">Contact Information</h3>
        <p><strong>Name:</strong> ${contactName}</p>
        <p><strong>Phone:</strong> ${contactPhone}</p>
        ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
      </div>

      ${notes ? `
      <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
        <h3 style="margin-top: 0; color: #333;">Call Notes</h3>
        <p style="white-space: pre-wrap;">${notes}</p>
      </div>
      ` : ''}

      <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #dee2e6; font-size: 14px; color: #6c757d;">
        <p><strong>Completed By:</strong> ${completedBy || 'CRM User'}</p>
        <p><strong>Timestamp:</strong> ${timestamp || new Date().toLocaleString()}</p>
      </div>

      <div style="margin-top: 30px; padding: 15px; background: #e7f3ff; border-radius: 8px; text-align: center;">
        <p style="margin: 0; font-size: 14px; color: #0056b3;">
          This is an automated notification from BTMTravel CRM Platform
        </p>
      </div>
    </div>
  </div>
</body>
</html>
    `;

    // Store notification in database
    const notificationId = `notification_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    await kv.set(notificationId, {
      type: 'call_completed',
      contactName,
      contactPhone,
      company,
      notes,
      completedBy,
      timestamp: timestamp || new Date().toISOString(),
      recipients,
      emailSubject,
      sentAt: new Date().toISOString()
    });

    console.log(`[EMAIL] Call notification stored with ID: ${notificationId}`);
    console.log(`[EMAIL] Would send to: ${recipients.join(", ")}`);
    console.log(`[EMAIL] Subject: ${emailSubject}`);
    console.log(`[EMAIL] Contact: ${contactName} (${contactPhone})`);

    // Note: In a production environment, you would integrate with an email service here
    // For example: SendGrid, Resend, AWS SES, or Supabase Email
    // Example with Resend (would require API key):
    // const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    // if (RESEND_API_KEY) {
    //   const response = await fetch('https://api.resend.com/emails', {
    //     method: 'POST',
    //     headers: {
    //       'Authorization': `Bearer ${RESEND_API_KEY}`,
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       from: 'crm@btmlimited.net',
    //       to: recipients,
    //       subject: emailSubject,
    //       html: emailBody,
    //     }),
    //   });
    // }

    return c.json({ 
      success: true, 
      message: "Call notification sent successfully",
      notificationId,
      recipients,
      note: "Email notification logged. To enable actual email sending, configure an email service provider (e.g., Resend, SendGrid)"
    });

  } catch (error) {
    console.error("[EMAIL ERROR] Failed to send call notification:", error);
    return c.json({ 
      success: false, 
      error: `Failed to send notification: ${error.message}` 
    }, 500);
  }
});

// Get notification history
app.get("/make-server-8fff4b3c/notifications", async (c) => {
  try {
    const notifications = await kv.getByPrefix("notification_");
    
    // Sort by timestamp (newest first)
    const sortedNotifications = notifications.sort((a, b) => {
      return new Date(b.value.sentAt).getTime() - new Date(a.value.sentAt).getTime();
    });

    return c.json({ 
      success: true, 
      notifications: sortedNotifications,
      count: sortedNotifications.length
    });
  } catch (error) {
    console.error("[NOTIFICATIONS ERROR] Failed to fetch notifications:", error);
    return c.json({ 
      success: false, 
      error: `Failed to fetch notifications: ${error.message}` 
    }, 500);
  }
});

// Save contact to database
app.post("/make-server-8fff4b3c/contacts", async (c) => {
  try {
    const body = await c.req.json();
    const { id, name, phone, company, status, lastContact, notes } = body;

    if (!id || !name || !phone) {
      return c.json({ 
        success: false, 
        error: "Missing required fields: id, name, and phone are required" 
      }, 400);
    }

    const contactKey = `contact_${id}`;
    await kv.set(contactKey, {
      id,
      name,
      phone,
      company,
      status,
      lastContact,
      notes,
      updatedAt: new Date().toISOString()
    });

    console.log(`[DATABASE] Contact saved: ${name} (${id})`);

    return c.json({ 
      success: true, 
      message: "Contact saved successfully",
      contactId: id
    });

  } catch (error) {
    console.error("[DATABASE ERROR] Failed to save contact:", error);
    return c.json({ 
      success: false, 
      error: `Failed to save contact: ${error.message}` 
    }, 500);
  }
});

// Get all contacts
app.get("/make-server-8fff4b3c/contacts", async (c) => {
  try {
    const contacts = await kv.getByPrefix("contact_");
    
    return c.json({ 
      success: true, 
      contacts: contacts.map(c => c.value),
      count: contacts.length
    });
  } catch (error) {
    console.error("[DATABASE ERROR] Failed to fetch contacts:", error);
    return c.json({ 
      success: false, 
      error: `Failed to fetch contacts: ${error.message}` 
    }, 500);
  }
});

// Get email recipients configuration
app.get("/make-server-8fff4b3c/email-recipients", async (c) => {
  try {
    const recipientsData = await kv.get("email_recipients");
    
    const defaultRecipients = [
      "operations@btmlimited.net",
      "quantityassurance@btmlimited.net", 
      "clientcare@btmlimited.net"
    ];
    
    const recipients = recipientsData?.value?.emails || defaultRecipients;
    
    return c.json({ 
      success: true, 
      recipients,
      isDefault: !recipientsData
    });
  } catch (error) {
    console.error("[EMAIL RECIPIENTS ERROR] Failed to fetch recipients:", error);
    return c.json({ 
      success: false, 
      error: `Failed to fetch email recipients: ${error.message}` 
    }, 500);
  }
});

// Update email recipients configuration
app.post("/make-server-8fff4b3c/email-recipients", async (c) => {
  try {
    const body = await c.req.json();
    const { emails } = body;

    if (!emails || !Array.isArray(emails)) {
      return c.json({ 
        success: false, 
        error: "Invalid request: emails must be an array" 
      }, 400);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = emails.filter(email => !emailRegex.test(email));
    
    if (invalidEmails.length > 0) {
      return c.json({ 
        success: false, 
        error: `Invalid email format: ${invalidEmails.join(", ")}` 
      }, 400);
    }

    await kv.set("email_recipients", {
      emails,
      updatedAt: new Date().toISOString()
    });

    console.log(`[EMAIL RECIPIENTS] Updated recipients: ${emails.join(", ")}`);

    return c.json({ 
      success: true, 
      message: "Email recipients updated successfully",
      recipients: emails
    });

  } catch (error) {
    console.error("[EMAIL RECIPIENTS ERROR] Failed to update recipients:", error);
    return c.json({ 
      success: false, 
      error: `Failed to update email recipients: ${error.message}` 
    }, 500);
  }
});

Deno.serve(app.fetch);