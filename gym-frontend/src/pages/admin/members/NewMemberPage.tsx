import { useNavigate } from 'react-router-dom'
import BreadCrumb from '@/shared/components/BreadCrumb'
import { Button } from '@/shared/components/ui/button'
import { Checkbox } from '@/shared/components/ui/checkbox'
import MemberForm from '@/features/members/components/MemberForm'
import PlanSelector from '@/features/membershipPlans/components/PlanSelector'
import PaymentMethodSelector from '@/features/payments/components/PaymentForm'
import { useNewMember } from '@/features/members/hooks/useNewMember'
import { usePageTitle } from '@/shared/context/PageHeaderContext'
import { ConfirmReactivateDialog } from '@/shared/components/ConfirmReactivateDialog'

export default function NewMemberPage() {
  usePageTitle("Alta de Socio")
  const navigate = useNavigate()
  const {
    plans,
    loading,
    selectedPlanId,
    setSelectedPlanId,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    includePayment,
    setIncludePayment,
    totalAmount,
    activationDate,
    expirationDate,
    handleSubmit,
    reactivateDialog,
    isReactivating,
    confirmReactivate,
    closeReactivateDialog,
  } = useNewMember()

  if (loading) {
    return (
      <div className="space-y-4">
        <BreadCrumb
          crumbs={[
            { label: 'Socios', href: '/administrativo/socios' },
            { label: 'Nuevo Socio' },
          ]}
        />
        <div className="rounded-xl border bg-background px-4 py-2 sm:px-6 text-center">
          <p>Cargando...</p>
        </div>
      </div>
    )
  }

  const dialogDescription =
    reactivateDialog.data?.reason === 'STATUS_INACTIVE'
      ? `El documento pertenece al socio inactivo ${reactivateDialog.data.name} ${reactivateDialog.data.surname} (sin membresía vigente).\n\n¿Deseas activarlo con el nuevo plan y pago ingresados? Conservará su usuario y contraseña actuales.`
      : `El documento pertenece a la cuenta de ${reactivateDialog.data?.name} ${reactivateDialog.data?.surname}, que fue dada de baja.\n\n¿Deseas reactivar la cuenta? El socio deberá volver a definir su contraseña al iniciar sesión.`

  return (
    <div className="space-y-4">
      <BreadCrumb
        crumbs={[
          { label: 'Socios', href: '/administrativo/socios' },
          { label: 'Nuevo Socio' },
        ]}
      />

      <div>
        <MemberForm onSubmit={handleSubmit} />
      </div>

      <section className="rounded-xl border bg-background px-4 py-4 sm:px-6 sm:py-6">
        <div className="mb-4 space-y-1">
          <h2 className="text-lg font-semibold">Seleccionar Plan</h2>
          <p className="text-sm text-muted-foreground">Elegí un plan para el nuevo socio.</p>
        </div>
        <PlanSelector
          plans={plans}
          selectedPlanId={selectedPlanId}
          onSelectPlan={setSelectedPlanId}
        />
      </section>

      <section className="gap-4 rounded-xl border bg-background px-4 py-4 sm:px-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Método de Pago</h2>
            <p className="text-sm text-muted-foreground">
              {includePayment ? `Seleccioná cómo se realizará el pago de la membresía.` : `No se registrará un pago inicial. La membresía se activa con 5 días de prueba.`}
            </p>
          </div>
          <Checkbox
            id="include-initial-payment"
            checked={includePayment}
            onCheckedChange={(checked) => setIncludePayment(checked === true)}
            aria-label="Registrar pago inicial"
            className="mt-1 shrink-0"
          />
        </div>

        <PaymentMethodSelector
          selectedMethod={selectedPaymentMethod}
          onSelectMethod={setSelectedPaymentMethod}
          totalAmount={totalAmount}
          activationDate={activationDate}
          expirationDate={expirationDate}
          disabled={!includePayment}
        />
      </section>

      <section className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/administrativo/socios')}
          className="w-full sm:w-auto"
        >
          Cancelar
        </Button>
        <Button type="submit" form="member-form" className="w-full sm:w-auto">
          Confirmar Alta
        </Button>
      </section>

      <ConfirmReactivateDialog
        open={reactivateDialog.open}
        title={
          reactivateDialog.data?.reason === 'STATUS_INACTIVE'
            ? 'Activar Socio Inactivo'
            : 'Reactivar Socio Dado de Baja'
        }
        description={dialogDescription}
        confirmText={
          reactivateDialog.data?.reason === 'STATUS_INACTIVE'
            ? 'Activar Socio'
            : 'Reactivar Cuenta'
        }
        isLoading={isReactivating}
        onClose={closeReactivateDialog}
        onConfirm={confirmReactivate}
      />
    </div>
  )
}
