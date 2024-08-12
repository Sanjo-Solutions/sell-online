import { AuthUser } from 'aws-amplify/auth'

export function generateIdentifier(user: AuthUser): string {
  return `${user.userId}::${user.username}`
}
