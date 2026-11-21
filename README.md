# Unsmoke — iPhone-first personal prototype

A lightweight, installable Progressive Web App (PWA) for a private personal trial. It is intentionally local-first: journal entries, check-ins and plan details are stored in the browser's `localStorage` on the device.

## What's included
- Home dashboard with smoke-free day count and estimated cigarettes avoided
- Craving SOS with a five-minute pause timer and grounding prompts
- Mood and craving-intensity check-in
- Trigger and lapse journal with non-judgemental language
- Quit date, usual daily cigarette count and top-trigger settings
- Local JSON export and delete-data controls
- PWA manifest and service worker for installation/offline shell

## Important limitations
- This is an early personal-use prototype, not a clinically validated cessation treatment.
- It does not diagnose, prescribe, provide NRT dosing, or replace a qualified healthcare professional.
- It does not currently include accounts, cloud sync, AI chat, notifications, analytics, payments, or clinician review.
- Data is stored in browser storage. Clearing Safari website data, using private browsing, or removing website data may erase it. Export your data before clearing browser storage.
- The Google Fonts import is optional and requires internet; system fonts are used if unavailable.

## Run locally
A PWA requires HTTPS or localhost for service-worker installation. From a computer with Python installed:

```bash
cd unsmoke-iphone
python3 -m http.server 8000
```

Then open `http://localhost:8000` in a browser on that computer. For iPhone testing, deploy the folder to an HTTPS static host (for example, GitHub Pages, Netlify, or Vercel).

## Install on iPhone
1. Open the deployed HTTPS address in Safari (not an in-app browser).
2. Tap Share.
3. Choose **Add to Home Screen**.
4. Open Unsmoke from the new Home Screen icon.

## Before public launch
Review the product's intended use and applicable Indian privacy, health, advertising and medical-device requirements. Have cessation content reviewed by qualified tobacco-cessation professionals. Add clear consent, privacy policy, secure backend controls and a support/escalation plan before collecting data from other people.
