import * as React from "react"


const cn = (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' ')

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-secondary", className)}
      {...props}
    />
  )
}

export { Skeleton }