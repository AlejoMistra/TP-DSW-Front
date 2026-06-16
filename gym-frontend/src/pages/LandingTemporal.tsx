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
      <CardContent className="pb-2">
        Las rutas del <a href="/administrativo" className="text-blue-500 underline">/administrativo</a> usa
        AdminLayout que muestra la barra lateral y renderizar el contenido de las páginas
      </CardContent>
      <CardContent>
        Vista del instructor en <a href="/instructor" className="text-blue-500 underline">/instructor</a> usa RoleSidebar (Sidebar de shadcn <a href="https://ui.shadcn.com/docs/components/radix/sidebar" target="_blank" className="text-blue-500 underline"> link a la doc</a>)
      </CardContent>
      <CardContent>
        Vista del socio en <a href="/socio" className="text-blue-500 underline">/socio</a> usa RoleSidebar (Sidebar de shadcn <a href="https://ui.shadcn.com/docs/components/radix/sidebar" target="_blank" className="text-blue-500 underline"> link a la doc</a>)
      </CardContent>
    </Card >
  )
}