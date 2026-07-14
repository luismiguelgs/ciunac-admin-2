"use client"

import type { DocumentProps } from "@react-pdf/renderer"
import type { ReactElement } from "react"
import * as React from "react"
import { FileText, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { PdfPreviewDialog } from "@/components/pdf-preview-dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CertificadoReporteService } from "../../certificado-reporte.service"
import { CertificadoReporteFormat, getCertificadoReporteYear } from "./certificado-reporte.format"

export function CertificadoReporteButton() {
    const [numberOpen, setNumberOpen] = React.useState(false)
    const [previewOpen, setPreviewOpen] = React.useState(false)
    const [value, setValue] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const [document, setDocument] = React.useState<ReactElement<DocumentProps> | null>(null)
    const [fileName, setFileName] = React.useState("")

    async function handleGenerate() {
        const parsed = Number(value)
        if (!/^\d{1,3}$/.test(value) || parsed < 1 || parsed > 999) {
            toast.error("Ingrese un correlativo entre 1 y 999")
            return
        }
        setLoading(true)
        try {
            const data = await CertificadoReporteService.fetchReport()
            const count = data.basico.digitales.length + data.basico.fisicos.length + data.intermedioAvanzado.digitales.length + data.intermedioAvanzado.fisicos.length
            if (!count) {
                toast.info("No existen certificados para generar el informe")
                return
            }
            const number = value.padStart(3, "0")
            const generatedAt = new Date()
            setDocument(<CertificadoReporteFormat data={data} reportNumber={number} generatedAt={generatedAt} />)
            setFileName(`Informe_${number}_${getCertificadoReporteYear(generatedAt)}_CAGDLCP.pdf`)
            setNumberOpen(false)
            setPreviewOpen(true)
        } catch (error) {
            console.error(error)
            toast.error("No se pudo generar el informe")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Button type="button" variant="outline" onClick={() => { setValue(""); setNumberOpen(true) }}><FileText className="h-4 w-4" />Informe de certificados</Button>
            <AlertDialog open={numberOpen} onOpenChange={setNumberOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>Generar informe de certificados</AlertDialogTitle><AlertDialogDescription>Ingrese el número correlativo del informe.</AlertDialogDescription></AlertDialogHeader>
                    <div className="space-y-2"><Label htmlFor="report-number">Número de informe</Label><Input id="report-number" value={value} onChange={event => setValue(event.target.value.replace(/\D/g, "").slice(0, 3))} placeholder="Ejemplo: 14" inputMode="numeric" /></div>
                    <AlertDialogFooter><AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel><AlertDialogAction disabled={loading} onClick={event => { event.preventDefault(); handleGenerate() }}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}{loading ? "Consultando..." : "Generar"}</AlertDialogAction></AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            {document ? <PdfPreviewDialog isOpen={previewOpen} onOpenChange={setPreviewOpen} title="Informe de certificados" downloadFileName={fileName}>{document}</PdfPreviewDialog> : null}
        </>
    )
}
