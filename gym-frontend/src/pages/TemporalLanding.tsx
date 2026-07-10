import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function TemporalLanding() {
  return (
    <Card className="max-w-2xl mx-auto mt-10">
      <CardHeader>
        <CardTitle>Project Overview</CardTitle>
        <CardDescription>
          Track progress and recent activity for your Vite app.
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-2">
        Las rutas principales <a href="/administrativo" className="text-blue-500 underline">/administrativo</a>, <a href="/instructor" className="text-blue-500 underline">/instructor</a> y <a href="/socio" className="text-blue-500 underline">/socio</a> usan el layout por roles `RoleLayout`.
        Este layout provee la barra lateral `RoleSidebar` y el área principal donde se montan las páginas.
      </CardContent>

      <CardContent>
        Se han integrado componentes de UI desde la librería <a href="https://ui.shadcn.com/" className="text-blue-500 underline" target="_blank">shadcn</a>: botones, diálogos, tablas y el sidebar (usado por `RoleSidebar`).
      </CardContent>

      <CardContent>
        Uso típico:
        <ul className="list-disc ml-6 mt-2">
          <li>Las rutas se configuran para envolver las páginas con `RoleLayout` según el rol del usuario.</li>
          <li>`RoleSidebar` recibe la lista de links desde `lib/sidebars.ts`.</li>
        </ul>
      </CardContent>
    </Card>
  )
}