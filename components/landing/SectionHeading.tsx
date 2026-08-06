import Reveal from '@/components/ui/Reveal';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  align?: 'center' | 'left';
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className,
}: SectionHeadingProps) {
  const centered = align === 'center';

  return (
    <Reveal className={cn('mb-14', centered && 'text-center', className)}>
      <div className={cn('section-badge', centered && 'mx-auto')}>{eyebrow}</div>
      <h2
        className="text-3xl sm:text-5xl font-extrabold text-card-foreground tracking-tight mt-4 mb-4"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            'text-muted-foreground max-w-2xl text-lg leading-relaxed',
            centered && 'mx-auto',
          )}
        >
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
