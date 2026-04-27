import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export default function Card({ children, className, padding = 'md', hover }: CardProps) {
  return (
    <div
      className={cn(
        'bg-card border border-border rounded-2xl',
        paddingClasses[padding],
        hover && 'transition-shadow duration-200 hover:shadow-lg',
        className,
      )}
    >
      {children}
    </div>
  );
}
