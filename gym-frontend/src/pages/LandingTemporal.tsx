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
        Las rutas del administrativo <a href="/administrativo" className="text-blue-500 underline">/Administrativo</a> usan
        el AdminLayout que se encarga de mostrar la barra lateral y renderizar el contenido de las páginas en el componente
      </CardContent>
      <CardContent>
        Vista del instructor en <a href="/instructor" className="text-blue-500 underline">/Instructor</a> aca estoy probando usar una sidebar reutilizable
      </CardContent>
    </Card >
  )
}