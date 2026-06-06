import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const LandingTemporal = () => {
  return (
    <Card className="max-w-sm mx-auto mt-10">
      <CardHeader>
        <CardTitle>Project Overview</CardTitle>
        <CardDescription>
          Track progress and recent activity for your Vite app.
        </CardDescription>
      </CardHeader>
      <CardContent>
        Las rutas de <a href="/admin" className="text-blue-500 underline">Admin</a> usan
        el AdminLayout que se encarga de mostrar la barra lateral y renderizar el contenido de las páginas en el componente <code>Outlet</code>.
      </CardContent>
    </Card >
  )
}