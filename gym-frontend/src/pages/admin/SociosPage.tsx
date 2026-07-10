import SociosDataTable from "@/components/SociosDataTable"
import { mockMembers } from "@/services/mockMembers"

export default function SocioPage1() {
  return <SociosDataTable initialData={mockMembers} />
}
