import type { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import Stripe from 'stripe'
import { env } from '$amplify/env/checkout.js'

const stripe = new Stripe(env.STRIPE_SECRET_KEY)

export const handler: APIGatewayProxyHandlerV2 = async event => {
  console.log('event', event)

  if (event.requestContext.http.method === 'POST') {
    try {
      const account = await stripe.accounts.create({
        controller: {
          stripe_dashboard: {
            type: 'express',
          },
          fees: {
            payer: 'application',
          },
          losses: {
            payments: 'application',
          },
        },
      })

      return {
        statusCode: 200,
        body: JSON.stringify({ account: account.id }),
      }
    } catch (error) {
      console.error(
        'An error occurred when calling the Stripe API to create an account:',
        error
      )
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      }
    }
  } else {
    return {
      statusCode: 501,
    }
  }
}
