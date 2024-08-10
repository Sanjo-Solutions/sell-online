'use client'

import Link from 'next/link.js'
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react'
import { LogOut } from '@/components/LogOut'

export function LayoutInner({ children }) {
  return (
    <Authenticator.Provider>
      <Navigation />

      {children}
    </Authenticator.Provider>
  )
}

function Navigation() {
  const { user } = useAuthenticator(({ route, signOut, user }) => [
    route,
    signOut,
    user,
  ])

  console.log('user', user)

  return (
    <nav className='navbar navbar-expand-lg bg-body-tertiary'>
      <div className='container-fluid'>
        <a className='navbar-brand' href='#'>
          Sell online
        </a>
        <button
          className='navbar-toggler'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbarSupportedContent'
          aria-controls='navbarSupportedContent'
          aria-expanded='false'
          aria-label='Toggle navigation'
        >
          <span className='navbar-toggler-icon' />
        </button>
        <div className='collapse navbar-collapse' id='navbarSupportedContent'>
          <ul className='navbar-nav me-auto'>
            {!user && (
              <li className='nav-item'>
                <Link
                  className='nav-link active'
                  aria-current='page'
                  href='/sign-up'
                >
                  Sign up as seller
                </Link>
              </li>
            )}
          </ul>

          <ul className='navbar-nav'>
            {!user && (
              <li className='nav-item'>
                <Link className='nav-link' aria-current='page' href='/login'>
                  Log in
                </Link>
              </li>
            )}

            {user && (
              <li className='nav-item'>
                <LogOut />
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}
