"use client"

import { CircleAlert } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface SolicitudDuplicadaDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    message: string
    solicitudId?: number
}

export function SolicitudDuplicadaDialog({
    open,
    onOpenChange,
    message,
    solicitudId,
}: SolicitudDuplicadaDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogMedia className="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                        <CircleAlert />
                    </AlertDialogMedia>
                    <AlertDialogTitle>Solicitud pendiente existente</AlertDialogTitle>
                    <AlertDialogDescription>
                        {message}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {solicitudId ? (
                    <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm dark:border-amber-900 dark:bg-amber-950/50">
                        Solicitud relacionada: <strong>#{solicitudId}</strong>
                    </div>
                ) : null}

                <AlertDialogFooter>
                    <AlertDialogAction variant="outline">Cerrar</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
