'use client'

import { signOut } from 'aws-amplify/auth'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

export function LogOut() {
  const router = useRouter()

  const logOut = useCallback(async function logOut() {
    await signOut()
    router.push('/')
  }, [])

  return (
    <button onClick={logOut} className='nav-link'>
      Log out
    </button>
  )
}
