import SociosDataTable from "@/components/SociosDataTable"
import { mockMembers } from "@/services/mockMembers"

export default function SociosPage() {
  return (
    <>
      <div className="mb-lg">
        <h2 className="font-headline-xl text-headline-xl text-on-surface mb-xs">Member Onboarding</h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant">Enter details to register a new athlete and assign a plan.</p>
      </div>
      <SociosDataTable initialData={mockMembers} />
    </>
  )
}
