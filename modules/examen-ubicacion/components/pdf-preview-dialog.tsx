'use client'

import React from "react"
import { PDFViewer } from "@react-pdf/renderer"
import type { DocumentProps } from "@react-pdf/renderer"
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface PdfPreviewDialogProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    title: string
    children: React.ReactElement<DocumentProps>
}

export function PdfPreviewDialog({ isOpen, onOpenChange, title, children }: PdfPreviewDialogProps) {
    return (
        <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
            <AlertDialogContent className="!w-[55vw] !max-w-[60rem]">
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        Vista previa del documento PDF generado.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="h-[75vh] w-full overflow-hidden rounded-md border">
                    {isOpen ? (
                        <PDFViewer width="100%" height="100%">
                            {children}
                        </PDFViewer>
                    ) : null}
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cerrar</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
