"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      richColors
      icons={{
        success: <CircleCheckIcon className="size-5 text-success" />,
        info: <InfoIcon className="size-5 text-info" />,
        warning: <TriangleAlertIcon className="size-5 text-warning" />,
        error: <OctagonXIcon className="size-5 text-destructive" />,
        loading: <Loader2Icon className="size-5 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background/80 group-[.toaster]:backdrop-blur-xl group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-2xl group-[.toaster]:rounded-xl group-[.toaster]:px-4 group-[.toaster]:py-3",
          description: "group-[.toast]:text-muted-foreground/90 text-sm mt-1 font-medium",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground font-semibold px-4 py-2",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground font-semibold px-4 py-2",
          success:
            "group-[.toaster]:bg-emerald-50/90 group-[.toaster]:text-emerald-900 group-[.toaster]:border-emerald-200 dark:group-[.toaster]:bg-emerald-950/90 dark:group-[.toaster]:text-emerald-50 dark:group-[.toaster]:border-emerald-900",
          error:
            "group-[.toaster]:bg-rose-50/90 group-[.toaster]:text-rose-900 group-[.toaster]:border-rose-200 dark:group-[.toaster]:bg-rose-950/90 dark:group-[.toaster]:text-rose-50 dark:group-[.toaster]:border-rose-900",
          info:
            "group-[.toaster]:bg-blue-50/90 group-[.toaster]:text-blue-900 group-[.toaster]:border-blue-200 dark:group-[.toaster]:bg-blue-950/90 dark:group-[.toaster]:text-blue-50 dark:group-[.toaster]:border-blue-900",
          warning:
            "group-[.toaster]:bg-amber-50/90 group-[.toaster]:text-amber-900 group-[.toaster]:border-amber-200 dark:group-[.toaster]:bg-amber-950/90 dark:group-[.toaster]:text-amber-50 dark:group-[.toaster]:border-amber-900",
        },
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
