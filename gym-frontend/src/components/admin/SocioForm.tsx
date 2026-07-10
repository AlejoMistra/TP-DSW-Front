import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/input"

export default function SocioForm() {
  return (
    <form className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
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
          <label htmlFor="tipo_doc" className="text-sm font-medium">
            Tipo de documento
          </label>
          <select
            id="tipo_doc"
            name="tipo_doc"
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="DNI">DNI</option>
            <option value="Pasaporte">Pasaporte</option>
            <option value="Otro">Otro</option>
          </select>
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

        <div className="space-y-2">
          <label htmlFor="fechaNacimiento" className="text-sm font-medium">
            Fecha de nacimiento
          </label>
          <Input id="fechaNacimiento" name="fechaNacimiento" type="date" />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <label htmlFor="estado" className="text-sm font-medium">
            Estado
          </label>
          <select
            id="estado"
            name="estado"
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" type="button">
          Cancelar
        </Button>
        <Button type="submit">Guardar</Button>
      </div>
    </form>
  )
}