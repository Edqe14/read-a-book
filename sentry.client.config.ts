// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://099b7084b2564d3e9e612ea4399d5da9@errors.edqe.me/1',

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: Number(process.env.SENTRY_SAMPLE_RATE ?? 1),

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
