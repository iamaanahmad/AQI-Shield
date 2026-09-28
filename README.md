# AQI Shield

A bilingual air-quality companion for Indian families.

Implementation started September 28, 2026, at the owner's explicit request. This predates the Environmental Hacks October 8 kickoff and must not be represented as an eligible event-built entry.

Frontend preview uses clearly labeled synthetic data and local browser history. AWS services, live air data and Bedrock are not connected. No AWS resources have been deployed.

## Run the frontend

```sh
cd frontend
npm ci
npm run dev
```

Open http://localhost:3000. `npm run build` exports static pages to `frontend/out`. `npm test` runs browser tests against the production export.

## What's working

- English/Hindi Home, Result and History pages, with remembered language.
- Six-city selection and optional browser location to select a nearby listed city.
- Clearly labeled fictional 12-hour forecast and illustrative 1–5 air index.
- Save, reopen and remove sample advisories in this browser, retained after refresh.
- Accessible controls and storage-failure messages.

History is limited to 30 samples. Clearing browser data clears history. Browser location is never sent anywhere. This is a frontend preview, not a source of current air or medical advice.

See `docs/backend-contract.md` for the later API integration. `amplify.yml` describes a future static Amplify build; adding it does not deploy anything.
