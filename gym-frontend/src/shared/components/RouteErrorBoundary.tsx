import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'

export default function RouteErrorBoundary() {
  const error = useRouteError()

  let errorMessage = 'Ocurrió un error inesperado al cargar esta sección.'
  let errorStatus: number | null = null

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status
    errorMessage = error.statusText || error.data?.message || errorMessage
  } else if (error instanceof Error) {
    errorMessage = error.message
  }

  const handleReload = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background text-foreground">
      <div className="max-w-md w-full rounded-2xl border border-border bg-card p-6 shadow-lg text-center space-y-4">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="size-7" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold tracking-tight">
            {errorStatus ? `Error ${errorStatus}` : 'Algo salió mal'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {errorMessage}
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
          <Button onClick={handleReload} className="gap-2 cursor-pointer">
            <RefreshCw className="size-4" />
            Reintentar
          </Button>
          <Button asChild variant="outline" className="gap-2 cursor-pointer">
            <Link to="/">
              <Home className="size-4" />
              Ir al inicio
            </Link>
          </Button>
        </div>

        {import.meta.env.DEV && error instanceof Error && error.stack && (
          <details className="mt-4 text-left text-xs text-muted-foreground border-t border-border pt-3">
            <summary className="cursor-pointer font-medium hover:text-foreground">
              Detalles técnicos (modo desarrollo)
            </summary>
            <pre className="mt-2 p-2 bg-muted/60 rounded-md overflow-x-auto text-[11px] font-mono leading-relaxed">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}