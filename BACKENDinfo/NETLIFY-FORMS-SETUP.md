# Contact Form → Email — Setup Guide

Good news: you don't need a "real" backend (no server, no database, no API keys, nothing that can be hacked). Netlify has a built-in feature called **Netlify Forms** that does exactly what you need — it reads form submissions straight out of your plain HTML and emails them to you. There's no code that processes or stores data on your own server, so there's no server for anyone to break into.

## What I changed and why

**`index.html`** — updated only the `<section class="contact">` block:
- Added `name="contact"`, `method="POST"`, and `data-netlify="true"` to the `<form>` tag. This is the flag that tells Netlify, "watch this form."
- Added a hidden `<input name="form-name" value="contact">`. Netlify needs this to match the submission back to the form. Without it, submissions get silently dropped.
- Added a **honeypot** field (`bot-field`), invisible to real visitors via inline positioning, plus `data-netlify-honeypot="bot-field"` on the form. Spam bots fill in every field they find, including hidden ones — a human never will. Netlify automatically throws away any submission where that field isn't empty.
- Added an empty `<p id="formStatus">` under the submit button, which the JS uses to show "message sent" or an error, instead of the old `alert()`.

**`app.js`** — updated only the contact form section:
- Removed the old code that just logged to console and showed a browser `alert()`.
- Replaced it with a `fetch()` call that submits the form data directly to Netlify in the background (AJAX), so the page never reloads. On success it shows a friendly "thanks, we'll be in touch" message inline and resets the form. On failure, it shows an error and your email address as a fallback.
- Everything else in the file (sliders, modals, project/case study/news cards, filters) is untouched.

**`success.html`** — a plain thank-you page. It's not actually used by the JS version (which shows the inline message instead), but it's good practice to have one in case JavaScript ever fails to load for a visitor — Netlify Forms works even without JavaScript, since it's a real HTML form POST.

## What YOU need to do (5 minutes, no code)

1. **Deploy these files to Netlify** the same way you were already planning to (drag-and-drop the folder into Netlify, or connect your Git repo) — replace your existing `index.html` and `app.js` with these versions, and add `success.html` alongside them.

2. **Turn on email notifications:**
   - Go to your site in the Netlify dashboard
   - **Site configuration → Notifications → Form submission notifications → Add notification → Email notification**
   - Enter the email address you want enquiries sent to (e.g. `info@manstal.co.uk`)
   - Leave "Event to listen for" as "New form submission"
   - Save

3. That's it. The first time Netlify builds/deploys the site, it scans the HTML, finds the form (because of `data-netlify="true"`), and starts collecting submissions automatically. You'll also be able to see every submission under the **Forms** tab in your Netlify dashboard, even without email.

## About spam and security

- The honeypot field blocks the vast majority of automated bot spam for free, with zero extra clicks for real visitors.
- Netlify also runs every submission through a spam filter (Akismet) automatically — no setup needed.
- If you ever start getting spam anyway, you can add a Google reCAPTCHA checkbox to the form later — just ask and I can add that too.
- There's no database, server, or API key involved anywhere in this setup, so there's no backend infrastructure that can be breached. The only "backend" is Netlify's own form-handling service, which is what large companies use for exactly this kind of simple form.

## Limits to know about

Netlify's free tier includes a limited number of form submissions per month (this can change, so check your Netlify plan's current allowance in the dashboard under **Forms → Usage**). For a typical company contact form this is normally more than enough — but if you ever expect very high volume, you'd want to check your plan's limits.

## If you ever outgrow Netlify Forms

If down the line you want more control (e.g. auto-replying to the customer, saving enquiries into a CRM, custom validation logic), that's when you'd move to a small **Netlify Function** (a tiny bit of serverless code Netlify also hosts for you) paired with an email API like Resend or SendGrid. That's a bigger step than you need right now, but it's good to know the option exists and it's still no traditional server to maintain.
