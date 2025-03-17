import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-[var(--color-skeleton-base)] before:absolute before:inset-0 before:content-[''] before:skeleton-gradient",
        className
      )}
      {...props}
    />
  )
} 