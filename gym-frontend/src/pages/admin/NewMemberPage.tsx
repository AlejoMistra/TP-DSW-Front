import SocioForm from "@/components/admin/SocioForm"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import BreadCrumb from "@/components/BreadCrumb"
import { Checkbox } from "@/components/ui/checkbox"
import { CreditCard, HandCoins, Landmark } from "lucide-react"

// TODO: Implementar el fetch al backend para los planes disponibles.
const availablePlans = [
  {
    id: "plan-basic",
    title: "Plan Basico",
    description: "Acceso libre a sala de musculacion.",
    price: "$28.000 / mes",
  },
  {
    id: "plan-plus",
    title: "Plan Plus",
    description: "Musculacion + clases grupales.",
    price: "$36.000 / mes",
  },
  {
    id: "plan-premium",
    title: "Plan Premium",
    description: "Todos los beneficios + seguimiento personalizado.",
    price: "$49.000 / mes",
  },
]

// TODO: Agregar validaciones de formulario y manejo de estado para los datos del socio, plan seleccionado y método de pago.
// TODO: Agregar lógica para mejorar la seccion de selección de plan (uno solo) y sincronizarlo con fechas y precio final.
// TODO: Se puede agregar un dialog para confirmar la alta del socio mostrando un resumen de los datos ingresados, plan seleccionado y método de pago antes de enviar la información al backend.

const paymentMethods = [
  { id: "card", label: "Tarjeta", icon: CreditCard },
  { id: "cash", label: "Efectivo", icon: HandCoins },
  { id: "bank", label: "Transferencia", icon: Landmark },
] as const

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date)
}

export default function NewMemberPage() {
  const [selectedPlanId, setSelectedPlanId] = useState<(typeof availablePlans)[number]["id"]>(availablePlans[0].id)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<(typeof paymentMethods)[number]["id"]>("card")

  const activationDate = useMemo(() => new Date(), [])

  const expirationDate = useMemo(() => {
    const nextDueDate = new Date(activationDate)
    nextDueDate.setMonth(nextDueDate.getMonth() + 1)
    return nextDueDate
  }, [activationDate])

  // FIXME: El breadcrumb todavía no tiene las rutas correctas.
  return (
    <div className="space-y-4">
      <BreadCrumb />
      <section className="rounded-xl border bg-background px-4 py-2 sm:px-6 sm:py-6">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Alta de Nuevo Socio
        </h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Completá los datos del socio, seleccioná un plan y definí el método de pago.
        </p>
      </section>

      <SocioForm showActions={false} />

      <section className="rounded-xl border bg-background px-4 py-4 sm:px-6 sm:py-6">
        <div className="mb-4 space-y-1">
          <h2 className="text-lg font-semibold">Selección de Plan</h2>
          <p className="text-sm text-muted-foreground">
            Elige uno de los planes disponibles para este nuevo socio.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {availablePlans.map((plan) => {
            const isSelected = selectedPlanId === plan.id

            return (
              <Card
                key={plan.id}
                className={isSelected ? "border-2 border-primary" : "border border-border/70"}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedPlanId(plan.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    setSelectedPlanId(plan.id)
                  }
                }}
                aria-pressed={isSelected}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <CardTitle>{plan.title}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </div>
                    <Checkbox
                      id={plan.id}
                      checked={isSelected}
                      aria-label={`Seleccionar ${plan.title}`}
                      className="pointer-events-none"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-base font-semibold">{plan.price}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      <section className="rounded-xl border bg-background px-4 py-4 sm:px-6 sm:py-6">
        <div className="mb-4 space-y-1">
          <h2 className="text-lg font-semibold">Método de Pago</h2>
          <p className="text-sm text-muted-foreground">
            Seleccioná cómo se realizará el pago de la inscripción.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="flex flex-wrap gap-2">
            {paymentMethods.map((method) => {
              const Icon = method.icon
              const isSelected = selectedPaymentMethod === method.id

              return (
                <Button
                  key={method.id}
                  type="button"
                  variant={isSelected ? "default" : "outline"}
                  onClick={() => setSelectedPaymentMethod(method.id)}
                  className="min-w-32"
                  aria-pressed={isSelected}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {method.label}
                </Button>
              )
            })}
          </div>

          <div className="space-y-1 border-border/80 pt-1 text-sm lg:border-l lg:pl-6 lg:text-right">
            <p>
              <span className="font-medium">Activación:</span> {formatDate(activationDate)}
            </p>
            <p>
              <span className="font-medium">Próximo vencimiento:</span> {formatDate(expirationDate)}
            </p>
          </div>
        </div>
      </section>

      <section className="flex justify-end">
        <Button type="button" className="w-full sm:w-auto">
          Confirmar Alta
        </Button>
      </section>
    </div>
  )
}