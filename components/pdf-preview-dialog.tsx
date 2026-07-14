"use client"

import type { DocumentProps } from "@react-pdf/renderer"
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer"
import type { ReactElement } from "react"
import { Download, Loader2 } from "lucide-react"
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

interface PdfPreviewDialogProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    title: string
    children: ReactElement<DocumentProps>
    downloadFileName?: string
}

export function PdfPreviewDialog({ isOpen, onOpenChange, title, children, downloadFileName }: PdfPreviewDialogProps) {
    return (
        <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
            <AlertDialogContent className="!w-[min(96vw,72rem)] !max-w-none">
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>Vista previa del documento PDF generado.</AlertDialogDescription>
                </AlertDialogHeader>
                <div className="h-[76vh] w-full overflow-hidden rounded-md border">
                    {isOpen ? <PDFViewer width="100%" height="100%">{children}</PDFViewer> : null}
                </div>
                <AlertDialogFooter>
                    {downloadFileName ? (
                        <PDFDownloadLink document={children} fileName={downloadFileName} className="inline-flex">
                            {({ loading }) => (
                                <Button type="button" variant="outline" disabled={loading}>
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                                    {loading ? "Preparando..." : "Descargar"}
                                </Button>
                            )}
                        </PDFDownloadLink>
                    ) : null}
                    <AlertDialogCancel>Cerrar</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
