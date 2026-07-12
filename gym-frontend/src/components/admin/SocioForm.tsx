import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User } from "lucide-react"

type SocioFormProps = {
  showActions?: boolean
}

export default function SocioForm({ showActions = true }: SocioFormProps) {
  return (
    <form className="rounded-xl border bg-background px-4 py-2 items-baseline sm:px-6 sm:py-6">
      <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold">
        <User className="size-5" aria-hidden="true" />
        Información del Socio
      </h3>

      <div className="grid gap-2 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="nombre" className="text-sm font-medium">
            Nombre
          </label>
          <Input id="nombre" name="nombre" placeholder="Nombre" />
        </div>

        <div className="space-y-2">
          <label htmlFor="apellido" className="text-sm font-medium">
            Apellido
          </label>
          <Input id="apellido" name="apellido" placeholder="Apellido" />
        </div>


        <div className="space-y-2">
          <label htmlFor="fechaNacimiento" className="text-sm font-medium">
            Fecha de nacimiento
          </label>
          <Input id="fechaNacimiento" name="fechaNacimiento" type="date" />
        </div>

        <div className="space-y-2">
          <label htmlFor="nro_doc" className="text-sm font-medium">
            Nº de documento
          </label>
          <Input id="nro_doc" name="nro_doc" placeholder="12345678" />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input id="email" name="email" type="email" placeholder="correo@ejemplo.com" />
        </div>

        <div className="space-y-2">
          <label htmlFor="telefono" className="text-sm font-medium">
            Teléfono
          </label>
          <Input id="telefono" name="telefono" placeholder="+54 9 11 1234 5678" />
        </div>
      </div>

      {showActions && (
        <div className="flex justify-end gap-2 py-4">
          <Button variant="outline" type="button">
            Cancelar
          </Button>
          <Button type="submit">
            Guardar
          </Button>
        </div>
      )}
    </form>
  )
}