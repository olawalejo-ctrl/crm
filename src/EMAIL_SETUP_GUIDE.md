# BTMTravel CRM - Email Notification Setup Guide

## Overview
Your BTMTravel CRM platform is now connected to Supabase and configured to send automated email notifications when calls are completed. The system has flexible email recipient management - you can add, edit, or remove email addresses at any time.

**Default Recipients** (can be customized):
- operations@btmlimited.net
- quantityassurance@btmlimited.net
- clientcare@btmlimited.net

## Current Status

✅ **Backend Connected** - Your CRM is connected to Supabase  
✅ **Database Logging** - All call completions are being saved  
⚠️ **Email Service Pending** - Requires email provider configuration

## What's Working Now

1. **Call Completion Tracking** - When you complete a call, the system logs:
   - Contact name and phone number
   - Company information
   - Call notes
   - Timestamp
   - Completion status

2. **Flexible Recipient Management** - Easily manage who receives notifications:
   - Add new email addresses
   - Remove old recipients
   - Update the list at any time
   - All changes saved to database

3. **Data Storage** - All notifications are saved to your Supabase database for tracking and audit purposes

4. **Email Templates** - Beautiful HTML email templates are ready with:
   - Contact information
   - Call notes
   - Timestamp
   - Branded BTMTravel styling

## To Enable Actual Email Sending

### Option 1: Resend (Recommended - Easiest)

1. **Sign up for Resend**
   - Go to https://resend.com
   - Create a free account (100 emails/day free)
   - Get your API key

2. **Add API Key to Supabase**
   - Go to your Supabase project settings
   - Navigate to Edge Functions → Secrets
   - Add a new secret: `RESEND_API_KEY` with your Resend API key

3. **Update Server Code**
   - Uncomment the Resend integration code in `/supabase/functions/server/index.tsx`
   - Replace the commented section with actual Resend API calls

### Option 2: SendGrid

1. **Sign up for SendGrid**
   - Go to https://sendgrid.com
   - Create account (100 emails/day free)
   - Get API key

2. **Add to Supabase**
   - Add `SENDGRID_API_KEY` to environment variables

3. **Update Server Code**
   - Integrate SendGrid SDK in the server code

## Managing Email Recipients

1. **Click "Email Setup" button** in the Daily Call List section
2. **View current recipients** - See all email addresses that will receive notifications
3. **Add new recipients**:
   - Enter email address in the input field
   - Click "Add" button or press Enter
   - Email is validated automatically
4. **Remove recipients**:
   - Hover over any email address
   - Click the X button to remove
5. **Save changes** - Click "Save Recipients" to apply changes
6. All changes are stored in your database permanently

## Testing Email Notifications

1. Click on any contact in the Daily Call List
2. Click "Start Call"
3. Add notes in the text area
4. Click "Complete Call"
5. Check your Supabase logs to see the notification was logged
6. Notifications will be sent to all configured recipients
7. Once email service is configured, emails will be sent automatically

## Viewing Notification History

All sent notifications are stored in your Supabase database with the prefix `notification_`. You can:

- View them via the Supabase dashboard
- Query them via the API endpoint: `/make-server-8fff4b3c/notifications`
- Export them for reporting

## Email Template Customization

The email template includes:
- Contact information (name, phone, company)
- Call notes
- Timestamp
- BTMTravel branding

To customize the template, edit the `emailBody` variable in `/supabase/functions/server/index.tsx`

## Support

If you need help with email configuration:
1. Click the "Email Setup" button in the CRM
2. Follow the step-by-step guide
3. Check the browser console for detailed logs

## Security Note

- Never expose API keys in client-side code
- Always store keys in Supabase environment variables
- Use the service role key only in server-side code
