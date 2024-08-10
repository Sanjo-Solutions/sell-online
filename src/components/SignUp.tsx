'use client'

import { withAuthenticator } from '@aws-amplify/ui-react'
import { AuthUser } from 'aws-amplify/auth'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'

function SignUpBase({ user }: { user?: AuthUser }) {
  useEffect(() => {
    if (user) {
      redirect('/')
    }
  }, [user])
  return null
}

export const SignUp = withAuthenticator(SignUpBase, { initialState: 'signUp' })
