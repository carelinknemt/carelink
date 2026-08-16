---
paths:
  - 'app/Mail/**'
---

# Mail

## Mailables extend shared CareLink brand email layout
All user-facing emails extend resources/views/mail/layout.blade.php (sections: title/subline/content/footer, slugged URLs via route(), primary CTA = .button #E64A19, header #004B87, footer includes dispatch phone + route('home')). Transactional emails are Blade views rendered from CarelinkBusinessPartnerController/BookController; auth emails are Mailable classes (ResetPasswordMail, VerifyEmailMail) with subjects prefixed "CareLink".
