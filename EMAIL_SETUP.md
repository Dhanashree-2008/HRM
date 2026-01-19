# Email Configuration for Employee Credentials

## Overview

When an admin creates a new employee, the system automatically:
1. Generates a password: `lastname + 4 random digits` (e.g., "sharma1234")
2. Sends login credentials to both:
   - Employee's personal email (if provided)
   - Company email (login email)

## Environment Variables Required

Add these to your `.env` file in the backend directory:

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_SERVICE=gmail
```

### Gmail Setup

1. Enable 2-Step Verification on your Google account
2. Generate an App Password:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Create a new app password for "Mail"
   - Use this 16-character password as `EMAIL_PASS`

### Other Email Services

For services other than Gmail, update `EMAIL_SERVICE`:
- Outlook: `outlook`
- Yahoo: `yahoo`
- Custom SMTP: Configure in `backend/src/utils/email.js`

## Password Generation Logic

**Format:** `lastname + 4 random digits`

**Examples:**
- "John Doe" → Password: `doe1234` (or `doe5678`, etc.)
- "Rahul Sharma" → Password: `sharma9876` (or `sharma1234`, etc.)
- "Priya" → Password: `priya4567` (if only one name provided)

**Rules:**
- Lastname is extracted from full name (last word)
- Converted to lowercase
- Special characters removed
- 4 random digits (1000-9999) appended

## Email Content

The email includes:
- Welcome message
- Employee Code
- Login Email (company email)
- Generated Password
- Security reminder to change password on first login
- Professional HTML formatting

## Email Sending

Emails are sent to:
1. **Personal Email** (if `personalEmail` is provided)
2. **Company Email** (login email - always sent)

Both emails contain the same credentials.

## Error Handling

- If email sending fails, employee creation still succeeds
- Error is logged but doesn't block the process
- Admin can manually share credentials if needed

## Testing

To test email functionality:

1. Ensure environment variables are set
2. Create a test employee with valid email addresses
3. Check both email inboxes for credentials
4. Verify password format matches: `lastname + 4 digits`

## Security Notes

- Password is **never** returned in API response
- Password is only sent via email
- Employee should change password on first login
- Email contains security warning about changing password

## Troubleshooting

**Email not sending:**
- Check `EMAIL_USER` and `EMAIL_PASS` in `.env`
- Verify Gmail App Password is correct
- Check backend console for error messages
- Ensure email addresses are valid

**Password format issues:**
- Ensure employee has a lastname in fullName
- Check console logs for password generation


