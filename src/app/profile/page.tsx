'use client'

import React, { useEffect, useState } from 'react'
import { post } from 'aws-amplify/api'
import { useAuthenticator } from '@aws-amplify/ui-react'
import { generateClient } from 'aws-amplify/data'
import { type Schema } from '../../../amplify/data/resource'

const client = generateClient<Schema>()

export default function Home() {
  const [accountCreatePending, setAccountCreatePending] = useState(false)
  const [accountLinkCreatePending, setAccountLinkCreatePending] =
    useState(false)
  const [error, setError] = useState(false)
  const [connectedAccountId, setConnectedAccountId] = useState<string | null>(
    null
  )

  const { user } = useAuthenticator(({ route, signOut, user }) => [
    route,
    signOut,
    user,
  ])

  useEffect(
    function () {
      async function a() {
        const profileOwner = `${user.userId}::${user.username}`

        const { data: profile, errors } = await client.models.UserProfile.get(
          {
            id: profileOwner,
          },
          {
            authMode: 'userPool',
          }
        )

        if (profile?.stripeAccountID) {
          setConnectedAccountId(profile.stripeAccountID)
        }
      }

      if (user) {
        a()
      }
    },
    [user]
  )

  return (
    <div className='container'>
      <div className='banner'>
        <h2>Sanjo Solutions UG (haftungsbeschränkt)</h2>
      </div>
      <div className='content'>
        {connectedAccountId && (
          <h2>Add information to start accepting money</h2>
        )}
        {connectedAccountId && (
          <p>
            Sanjo Solutions UG (haftungsbeschränkt) partners with Stripe to help
            you receive payments while keeping your personal and bank details
            secure.
          </p>
        )}
        {connectedAccountId && !accountLinkCreatePending && (
          <button
            onClick={async () => {
              setAccountLinkCreatePending(true)
              setError(false)
              // TODO: Is the endpoint secure?
              const operation = post({
                apiName: 'API',
                path: 'account-link',
                options: {
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: {
                    account: connectedAccountId,
                  },
                },
              })
              const response = await operation.response
              console.log('response', response)
              const json = await response.body.json()
              setAccountLinkCreatePending(false)
              const { url, error } = json
              if (url) {
                window.location.href = url
              }

              if (error) {
                setError(true)
              }
            }}
          >
            Add information
          </button>
        )}
        {error && <p className='error'>Something went wrong!</p>}
        {(connectedAccountId ||
          accountCreatePending ||
          accountLinkCreatePending) && (
          <div className='dev-callout'>
            {connectedAccountId && (
              <p>
                Your connected account ID is:{' '}
                <code className='bold'>{connectedAccountId}</code>
              </p>
            )}
            {accountCreatePending && <p>Creating a connected account...</p>}
            {accountLinkCreatePending && <p>Creating a new Account Link...</p>}
          </div>
        )}
        <div className='info-callout'>
          <p>
            This is a sample app for Stripe-hosted Connect onboarding.{' '}
            <a
              href='https://docs.stripe.com/connect/onboarding/quickstart?connect-onboarding-surface=hosted'
              target='_blank'
              rel='noopener noreferrer'
            >
              View docs
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
