import { useEffect, useState } from "react"
import { Button } from "@/components/ui/Button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import SocioForm from "@/components/admin/SocioForm"
import { socioService } from "@/services/socioService"
import type { Socio } from "@/models/Socio"

export default function SociosPage() {
  const [socios, setSocios] = useState<Socio[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    void (async () => {
      try {
        const data = await socioService.getAllSocios()
        setSocios(data)
      } catch (err) {
        setError(String(err) || 'Error al cargar socios')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <>
      {loading && <div>Cargando...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && (
        <div className="p-6 space-y-4">
          <div className="flex space-x-4">
            <h1 className="text-2xl font-semibold">Socios</h1>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  Nuevo socio
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Registrar socio</DialogTitle>
                </DialogHeader>
                <SocioForm />
              </DialogContent>
            </Dialog>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}
          {loading ? (
            <div className="text-sm">Cargando...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-25">Id</TableHead>
                  <TableHead>Nombre Completo</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead className="text-right">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {socios.map((s) => (
                  <TableRow key={s.id}>
                    {/*TODO: Terminar de acomodar las columnas que se muestan*/}
                    <TableCell>{s.id}</TableCell>
                    <TableCell>{`${s.nombre} ${s.apellido}`}</TableCell>
                    <TableCell>{/* placeholder: adaptar cuando exista plan */}-</TableCell>
                    <TableCell className="text-right">{s.estado}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div >
      )}
    </>
  )
}

