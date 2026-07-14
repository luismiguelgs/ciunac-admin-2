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

interface CertificadoSaveErrorDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    message: string
}

export function CertificadoSaveErrorDialog({ open, onOpenChange, message }: CertificadoSaveErrorDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogMedia className="bg-destructive/10 text-destructive">
                        <CircleAlert />
                    </AlertDialogMedia>
                    <AlertDialogTitle>No se pudo guardar el certificado</AlertDialogTitle>
                    <AlertDialogDescription>{message}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction variant="outline">Cerrar</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
