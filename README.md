# Antonio Gomariz - Portfolio

Modern portfolio website showcasing photography, music curation, and web design work.

## Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Modular architecture with CSS custom properties
- **JavaScript (ES6+)** - Modern modular approach
- **Vercel** - Hosting and serverless functions

## Project Structure

```
antoniogomariz-portfolio/
├── api/
│   └── contact.js          # Serverless function for contact form
├── css/
│   ├── modules/
│   │   ├── variables.css   # CSS custom properties
│   │   ├── reset.css       # Reset and base styles
│   │   ├── animations.css  # Animations and transitions
│   │   ├── header.css      # Header and navigation
│   │   ├── components.css  # Reusable components
│   │   ├── layout.css      # Section layouts
│   │   └── footer.css      # Footer styles
│   └── styles.css          # Main CSS file (imports modules)
├── js/
│   ├── modules/
│   │   ├── utils.js        # Utility functions
│   │   ├── navigation.js   # Navigation logic
│   │   ├── animations.js   # Scroll animations
│   │   └── forms.js        # Form handling
│   └── main.js             # Main JavaScript entry point
├── images/                 # Image assets
├── index.html              # Homepage
├── thank-you.html          # Thank you page
├── vercel.json             # Vercel configuration
└── [project pages]         # Gallery, music curation, web design
```

## Features

- ✨ Modern, responsive design
- 🎨 Clean modular CSS architecture
- 📱 Mobile-first approach
- ♿ Accessible (ARIA labels, semantic HTML)
- 🚀 Optimized performance
- 📧 Contact form with serverless API
- 🎭 Smooth animations and transitions

## Color Palette

- Primary: `#9F1822` (Deep Red)
- Background: `#000000` (Black)
- Text: `#FFFFFF` (White)
- Typography: Montserrat (400, 500, 700)

## Development

The project uses ES6 modules and modern CSS features. No build process required for development.

## Deployment

Configured for deployment on Vercel with serverless functions support.

### Contact Form Setup

The contact form uses a Vercel serverless function at `/api/contact`. To enable email sending:

1. Choose an email service (SendGrid, Resend, etc.)
2. Add API keys to Vercel environment variables
3. Uncomment the relevant code in `/api/contact.js`

See `/api/contact.js` for detailed integration instructions.

---

**© 2024 Antonio Gomariz. All rights reserved.**
