'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { post } from 'aws-amplify/api'
import { useAuthenticator } from '@aws-amplify/ui-react'
import { generateClient } from 'aws-amplify/data'
import { type Schema } from '../../../amplify/data/resource'
import { generateIdentifier } from '@/user/generateIdentifier'

const client = generateClient<Schema>()

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [profile, setProfile] = useState<any>(null)
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
        const profileOwner = generateIdentifier(user)

        const { data: profile, errors } = await client.models.UserProfile.get(
          {
            id: profileOwner,
          },
          {
            authMode: 'userPool',
          }
        )

        if (profile) {
          if (profile?.stripeAccountID) {
            setConnectedAccountId(profile.stripeAccountID)
          }
          setProfile(profile)
          setIsLoading(false)
        }
      }

      if (user) {
        a()
      }
    },
    [user]
  )

  const onSubmit = useCallback(
    async function onSubmit(event) {
      event.preventDefault()
      const form = event.target
      const isValid = form.checkValidity()
      if (!isValid) {
        event.stopPropagation()
      }
      form.classList.add('was-validated')
      if (isValid) {
        const formData = new FormData(form)
        const slug = formData.get('slug')?.toString()
        const { data, errors } = await client.models.UserProfile.update(
          {
            id: generateIdentifier(user),
            slug,
          },
          {
            authMode: 'userPool',
          }
        )
      }
    },
    [user]
  )

  return (
    <>
      <h2>Profile</h2>

      <div>
        {connectedAccountId && !accountLinkCreatePending && (
          <button
            className='btn btn-secondary mb-3'
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
      </div>

      <form onSubmit={onSubmit} noValidate>
        <div className='mb-3'>
          <label htmlFor='slug' className='form-label'>
            Profile slug
          </label>
          <input
            type='text'
            className='form-control'
            id='slug'
            name='slug'
            aria-describedby='slugHelpBlock'
            required
            defaultValue={profile?.slug}
            disabled={isLoading}
          />
          <div id='slugHelpBlock' className='form-text'>
            The path to your profile: www.sell-online.com/&lt;slug&gt;
          </div>
        </div>

        <div className='text-end'>
          <button type='submit' className='btn btn-primary'>
            Save
          </button>
        </div>
      </form>
    </>
  )
}
