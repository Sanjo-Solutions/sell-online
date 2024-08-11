import type { PostConfirmationTriggerHandler } from 'aws-lambda'
import { type Schema } from '../../data/resource'
import { Amplify } from 'aws-amplify'
import { generateClient } from 'aws-amplify/data'
import { env } from '$amplify/env/post-confirmation'
import { createUserProfile } from './graphql/mutations'
import Stripe from 'stripe'

const stripe = new Stripe(env.STRIPE_SECRET_KEY)

Amplify.configure(
  {
    API: {
      GraphQL: {
        endpoint: env.AMPLIFY_DATA_GRAPHQL_ENDPOINT,
        region: env.AWS_REGION,
        defaultAuthMode: 'iam',
      },
    },
  },
  {
    Auth: {
      credentialsProvider: {
        getCredentialsAndIdentityId: async () => ({
          credentials: {
            accessKeyId: env.AWS_ACCESS_KEY_ID,
            secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
            sessionToken: env.AWS_SESSION_TOKEN,
          },
        }),
        clearCredentialsAndIdentityId: () => {
          /* noop */
        },
      },
    },
  }
)

const client = generateClient<Schema>({
  authMode: 'iam',
})

export const handler: PostConfirmationTriggerHandler = async event => {
  try {
    const account = await stripe.accounts.create({
      type: 'standard',
    })

    await client.graphql({
      query: createUserProfile,
      variables: {
        input: {
          id: `${event.request.userAttributes.sub}::${event.userName}`,
          email: event.request.userAttributes.email,
          stripeAccountID: account.id,
        },
      },
    })
  } catch (error) {
    console.error('error', error)
  }

  return event
}
