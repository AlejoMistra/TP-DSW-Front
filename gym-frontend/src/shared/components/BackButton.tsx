import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button.tsx"
import { ArrowLeft } from "lucide-react"


export default function BackButton({ text = "Volver", to = "" }: { text?: string; to?: string }) {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-between">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => (to ? navigate(to) : navigate(-1))}
        className="text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-1 size-4" />
        {text}
      </Button>
    </div>
  )
}