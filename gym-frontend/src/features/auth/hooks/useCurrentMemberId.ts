import { useAuth } from './useAuth'

export function useCurrentMemberId(): number | null {
  const { user } = useAuth()

  if (user?.role !== 'member') {
    return null
  }

  return user.memberId
}