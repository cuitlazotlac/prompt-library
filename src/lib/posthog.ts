import posthog from 'posthog-js'

const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
export const posthogConfigured = Boolean(posthogKey);

if (posthogConfigured) {
  posthog.init(posthogKey, {
    api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com',
    debug: import.meta.env.DEV,
    autocapture: !import.meta.env.DEV,
    capture_pageview: false,
    capture_pageleave: false,
  })
}

// Helper functions
export const identify = (id: string, properties?: Record<string, any>) => {
  if (posthogConfigured) posthog.identify(id, properties)
}

export const capture = (eventName: string, properties?: Record<string, any>) => {
  if (posthogConfigured) posthog.capture(eventName, properties)
}

export const isFeatureEnabled = (key: string) => {
  return posthogConfigured ? posthog.isFeatureEnabled(key) : false
}

export const getFeatureFlag = (key: string) => {
  return posthogConfigured ? posthog.getFeatureFlag(key) : undefined
}

// Export PostHog instance for direct access if needed
export default posthog
