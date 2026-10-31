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

Run the same quality checks locally as the GitHub Actions workflow:

```bash
npm ci
npm run typecheck
npm run typecheck:tests
npm test
npm run build
npm run audit:all
```

- Use Node.js 22 for consistent CI and local results.
- Tests use Node.js's built-in test runner and `tsx` to load `.test.ts` and `.test.tsx` files recursively from `src/`. The dedicated `tsconfig.tests.json` also typechecks test files.
- CI runs on pushes to all branches and on pull requests targeting `main`. Concurrent runs for the same branch are superseded to limit redundant checks.
- The separate dependency-audit job checks all dependencies and fails if npm reports a **high** or **critical** advisory. Audit results depend on npm registry availability and the advisory database; it does not modify packages.
- An audit result is not a guarantee that the project has no vulnerabilities.
- The CI workflow performs **no deployment** and uses read-only repository permissions.
- Add environment values from `.env.example` as needed for local contact form testing; no credentials are required for the static build.
