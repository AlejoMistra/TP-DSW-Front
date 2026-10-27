import type { LucideIcon } from 'lucide-react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  Card,
  CardContent,
} from '@/shared/components/ui/card'

type ProfileNavigationCardProps = {
  to: string
  title: string
  description: string
  icon: LucideIcon
}

export default function ProfileNavigationCard({
  to,
  title,
  description,
  icon: Icon,
}: ProfileNavigationCardProps) {
  return (
    <Link to={to} className="group block">
      <Card className="h-full border-border/70 bg-card/80 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/70 hover:shadow-md">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <Icon className="size-6" />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="font-bold text-foreground">
              {title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {description}
            </p>
          </div>

          <ArrowRight className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
        </CardContent>
      </Card>
    </Link>
  )
}