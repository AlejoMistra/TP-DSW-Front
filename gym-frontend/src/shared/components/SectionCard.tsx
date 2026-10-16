import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/shared/utils/utils';
export interface SectionCardProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  headerAction?: {
    label: string;
    to: string;
    icon?: LucideIcon;
  };
  footerLink?: {
    label: string;
    to: string;
    icon?: LucideIcon;
  };
  children: ReactNode;
  className?: string;
}

export function SectionCard({
  title,
  subtitle,
  icon: Icon,
  headerAction,
  footerLink,
  children,
  className,
}: SectionCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col rounded-3xl border border-border/70 bg-card p-5 sm:p-6 text-card-foreground shadow-sm',
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between pb-4 border-b border-border/40">
        <div className="flex items-start gap-3">
          {Icon && (
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl text-primary">
              <Icon className="size-5" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
                {title}
              </h2>
            </div>
            {subtitle && (
              <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>

        {headerAction && (
          <Link
            to={headerAction.to}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline hover:opacity-85 self-start sm:self-auto"
          >
            <span>{headerAction.label}</span>
            {headerAction.icon ? (
              <headerAction.icon className="size-3.5" />
            ) : (
              <ArrowRight className="size-3.5" />
            )}
          </Link>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 py-4">{children}</div>

      {/* Footer Link */}
      {footerLink && (
        <div className="pt-3 border-t border-border/40">
          <Link
            to={footerLink.to}
            className="group flex items-center justify-between text-xs font-medium text-primary hover:opacity-85 transition-opacity"
          >
            <span>{footerLink.label}</span>
            {footerLink.icon ? (
              <footerLink.icon className="size-4 text-primary transition-transform group-hover:translate-x-0.5" />
            ) : (
              <ArrowRight className="size-4 text-primary transition-transform group-hover:translate-x-0.5" />
            )}
          </Link>
        </div>
      )}
    </div>
  );
}

export default SectionCard;

