import type { LucideIcon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/shared/utils/utils';

export interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  to?: string;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  iconClassName?: string;
}

export function QuickActionCard({
  title,
  description,
  icon: Icon,
  to,
  disabled = false,
  onClick,
  className,
  iconClassName,
}: QuickActionCardProps) {
  const content = (
    <div
      className={cn(
        'group relative flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-5 text-card-foreground transition-all duration-200',
        disabled
          ? 'cursor-not-allowed opacity-60'
          : 'hover:border-primary/50 hover:bg-muted/40 hover:shadow-md cursor-pointer',
        className
      )}
      onClick={disabled ? undefined : onClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={cn(
            'flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105',
            iconClassName
          )}
        >
          <Icon className="size-5" />
        </div>
        <div className="rounded-full p-1 text-muted-foreground transition-all group-hover:text-primary group-hover:translate-x-0.5">
          <ArrowRight className="size-4" />
        </div>
      </div>

      <div className="mt-4 space-y-1">
        <h3 className="font-semibold text-base leading-snug tracking-tight text-foreground transition-colors">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>
    </div>
  );

  if (to && !disabled) {
    return (
      <Link to={to} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl">
        {content}
      </Link>
    );
  }

  return content;
}

export default QuickActionCard;

