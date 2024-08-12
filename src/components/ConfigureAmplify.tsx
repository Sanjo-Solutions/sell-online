'use client'

import { Amplify } from 'aws-amplify'
import outputs from '../../amplify_outputs.json'
import { fetchAuthSession } from 'aws-amplify/auth'
import { useEffect } from 'react'
import { Hub } from 'aws-amplify/utils'

const defaultLibraryOptions = { ssr: true }

Amplify.configure(outputs, { ssr: true })
const existingConfig = Amplify.getConfig()
Amplify.configure(
  {
    ...existingConfig,
    API: {
      ...existingConfig.API,
      REST: outputs.custom.API,
    },
  },
  { ...defaultLibraryOptions }
)

export function ConfigureAmplifyClientSide() {
  useEffect(function () {
    async function updateAuthorization() {
      const session = await fetchAuthSession()
      const authToken = session.tokens?.idToken?.toString()

      const libraryOptions: any = {
        ...defaultLibraryOptions,
      }

      if (authToken) {
        libraryOptions.API = {
          REST: {
            headers: async () => {
              return {
                Authorization: authToken,
              }
            },
          },
        }
      }

      Amplify.configure(Amplify.getConfig(), libraryOptions)
    }

    updateAuthorization()

    const hubListenerCancelToken = Hub.listen('auth', () => {
      updateAuthorization()
    })

    return () => {
      hubListenerCancelToken()
    }
  }, [])

  return null
}
