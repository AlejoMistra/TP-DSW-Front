import { usePageTitle } from '@/shared/context/PageHeaderContext.tsx'
import CurrentMembershipInfo from '@/features/memberships/components/CurrentMembershipInfo'

export default function HomePage() {
  usePageTitle("Inicio")

  return (
    <div>
      <h1>Welcome to the Gym Member Home Page</h1>
    </div>
  )
}