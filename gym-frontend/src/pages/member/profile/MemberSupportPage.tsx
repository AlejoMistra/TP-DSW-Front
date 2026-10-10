import {
  Clock3,
  FileText,
  HelpCircle,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from 'lucide-react'

import { usePageTitle } from '@/shared/context/PageHeaderContext'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'

import {
  applicationInformation,
  frequentlyAskedQuestions,
  legalInformation,
  supportContact,
} from '@/config/support/supportContent'
import BackButton from '@/shared/components/BackButton.tsx'

export default function MemberSupportPage() {
  usePageTitle('Soporte')

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div>
        <BackButton
          text="Volver"
          to="/socio/perfil"
        />
        <h1 className="text-2xl font-bold tracking-tight">
          Soporte
        </h1>

        <p className="text-sm text-muted-foreground">
          Encontrá respuestas y formas de comunicarte con el gimnasio.
        </p>
      </div>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <HelpCircle className="size-5 text-primary" />

          <h2 className="text-xl font-bold">
            Preguntas frecuentes
          </h2>
        </div>

        <div className="space-y-3">
          {frequentlyAskedQuestions.map((question) => (
            <details
              key={question.question}
              className="group rounded-2xl border border-border/70 bg-card/80 p-4 shadow-sm"
            >
              <summary className="cursor-pointer list-none font-semibold marker:hidden">
                <div className="flex items-center justify-between gap-4">
                  <span>{question.question}</span>

                  <span className="text-xl text-primary transition-transform group-open:rotate-45">
                    +
                  </span>
                </div>
              </summary>

              <p className="mt-3 border-t pt-3 text-sm leading-6 text-muted-foreground">
                {question.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold">
            Contacto del gimnasio
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border/70 bg-card/80 shadow-sm">

            <CardContent className="space-y-3 p-5">
              <Mail className="size-6 text-primary" />

              <div>
                <p className="text-sm text-muted-foreground">
                  Email
                </p>

                <a
                  href={`mailto:${supportContact.email}`}
                  className="break-all text-sm font-semibold hover:text-primary"
                >
                  {supportContact.email}
                </a>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/80 shadow-sm">
            <CardContent className="space-y-3 p-5">
              <Phone className="size-6 text-primary" />

              <div>
                <p className="text-sm text-muted-foreground">
                  Teléfono
                </p>

                <a
                  href={`tel:${supportContact.phone}`}
                  className="text-sm font-semibold hover:text-primary"
                >
                  {supportContact.phone}
                </a>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/80 shadow-sm">
            <CardContent className="space-y-3 p-5">
              <MapPin className="size-6 text-primary" />

              <div>
                <p className="text-sm text-muted-foreground">
                  Dirección
                </p>

                <p className="text-sm font-semibold">
                  {supportContact.address}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/80 shadow-sm">
            <CardContent className="space-y-3 p-5">
              <Clock3 className="size-6 text-primary" />

              <div>
                <p className="text-sm text-muted-foreground">
                  Horarios
                </p>

                <p className="text-sm font-semibold">
                  {supportContact.hours}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold">
            Información adicional
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-border/70 bg-card/80 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="size-5 text-primary" />
                {legalInformation.terms.title}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-sm leading-6 text-muted-foreground">
                {legalInformation.terms.content}
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/80 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ShieldCheck className="size-5 text-primary" />
                {legalInformation.privacy.title}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-sm leading-6 text-muted-foreground">
                {legalInformation.privacy.content}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Card className="border-border/70 bg-card/80 shadow-sm">
        <CardContent className="flex items-center justify-between gap-4 p-5">
          <div>
            <p className="font-semibold">
              {applicationInformation.name}
            </p>

            <p className="text-sm text-muted-foreground">
              Versión de la aplicación
            </p>
          </div>

          <span className="rounded-full bg-primary/15 px-3 py-1 text-sm font-semibold text-primary">
            v{applicationInformation.version}
          </span>
        </CardContent>
      </Card>
    </div>
  )
}