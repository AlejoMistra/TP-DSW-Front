import { Mail, UserRound } from 'lucide-react'
import {
  Avatar,
  AvatarFallback,
} from '@/shared/components/ui/avatar'
import { Card, CardContent } from '@/shared/components/ui/card'

type ProfileSummaryProps = {
  name: string
  email: string
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export default function ProfileSummary({
  name,
  email,
}: ProfileSummaryProps) {
  return (
    <Card className="border-border/70 bg-card/80 shadow-sm">
      <CardContent className="flex flex-col items-center gap-4 px-6 py-8 text-center">
        <Avatar size="lg" className="size-24 ring-4 ring-primary/20">
          <AvatarFallback className="bg-primary/15 text-2xl font-bold text-primary">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <UserRound className="size-4 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">
              {name}
            </h1>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Mail className="size-4" />
            <span>{email}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}