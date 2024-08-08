import { defineFunction, secret } from '@aws-amplify/backend'

export const checkout = defineFunction({
  runtime: 20,
  environment: {
    STRIPE_SECRET_KEY: secret('STRIPE_SECRET_KEY'),
  },
})
