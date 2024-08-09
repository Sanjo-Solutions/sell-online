import type { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import Stripe from 'stripe'
import { env } from '$amplify/env/checkout.js'

const stripe = new Stripe(env.STRIPE_SECRET_KEY)

export const handler: APIGatewayProxyHandlerV2 = async event => {
  console.log('event', event)

  if (event.requestContext.http.method === 'POST') {
    try {
      const { account } = JSON.parse(event.body!)

      const accountLink = await stripe.accountLinks.create({
        account: account,
        refresh_url: `${event.headers.origin}/refresh/${account}`,
        return_url: `${event.headers.origin}/return/${account}`,
        type: 'account_onboarding',
      })

      return {
        statusCode: 200,
        body: JSON.stringify({
          url: accountLink.url,
        }),
      }
    } catch (error: any) {
      console.error(
        'An error occurred when calling the Stripe API to create an account link:',
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
