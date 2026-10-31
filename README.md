# Rahmat Hidayat - Portfolio (React + TypeScript)

A modern, responsive personal portfolio website built with React, TypeScript, and Vite. Rewritten from the original static web project to provide clean component architecture, reactive state management, interactive modals, and preserved authentic design fidelity.

## Features

- **Hero & Profile:** Animated typed role carousel ("Open to Work", "Information System", "Data Analyst"), portrait blob mask, quick contact trigger, and smooth journey scroll.
- **About:** Comprehensive profile summary and direct CV download.
- **Skills Showcase:**
  - Soft Skills with dynamic show more/less toggle.
  - Technical Skills with proficiency labels, technology badges, and collapsible details.
- **Certifications Gallery:**
  - Featured certificates display on the homepage.
  - Full certificates gallery view with complete credential details (Dicoding, Cisco Networking Academy, Sololearn, HIMSI, OSIS, Scout).
  - High-resolution certificate modal preview and PDF view/download links.
- **Qualifications / Background:** Interactive tab switching between Education history and Organizational leadership experience with a visual vertical timeline.
- **Projects Carousel:** Responsive portfolio project slider with touch swipe, arrow buttons, pagination dots, and keyboard navigation.
- **Contact Me:** Contact information (Email & DKI Jakarta, Indonesia) plus contact form integrated with EmailJS, form validation, and toast status notification.
- **Dark Mode:** System and user theme switching with local storage persistence.
- **Responsive Layout:** Optimized for mobile, tablet, and desktop viewports.

## Tech Stack

- **Framework:** React 18
- **Language:** TypeScript
- **Bundler:** Vite
- **Styling:** CSS variables, responsive grid & flexbox design system
- **Email Service:** EmailJS Browser SDK
- **Icons:** Unicons Line Icons

## Running Locally

```bash
# Install reproducible dependencies
npm ci

# Start development server
npm run dev

# Build for production
npm run build
```

## Quality Checks

Run the same checks locally that GitHub Actions runs on feature-branch pushes and pull requests:

```bash
npm ci
npm run typecheck
npm test
npm run build
```

- Use Node.js 22 for consistent CI and local results.
- Tests use Node.js's built-in test runner with `tsx` to load TypeScript.
- The CI workflow performs **no deployment** and uses read-only repository permissions.
- Add environment values from `.env.example` as needed for local contact form testing; no credentials are required for the static build.
