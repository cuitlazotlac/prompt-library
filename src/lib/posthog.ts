import posthog from 'posthog-js'

// Initialize PostHog with your project API key
posthog.init(import.meta.env.VITE_POSTHOG_KEY || '', {
  api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com',
  // Enable debug mode in development
  debug: import.meta.env.DEV,
  // Disable autocapture in development
  autocapture: !import.meta.env.DEV,
  // Disable capturing by default
  capture_pageview: false,
  capture_pageleave: false,
})

// Helper functions
export const identify = (id: string, properties?: Record<string, any>) => {
  posthog.identify(id, properties)
}

export const capture = (eventName: string, properties?: Record<string, any>) => {
  posthog.capture(eventName, properties)
}

export const isFeatureEnabled = (key: string) => {
  return posthog.isFeatureEnabled(key)
}

export const getFeatureFlag = (key: string) => {
  return posthog.getFeatureFlag(key)
}

// Export PostHog instance for direct access if needed
export default posthog 