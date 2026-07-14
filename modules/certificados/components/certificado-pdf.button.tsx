"use client"

import type { DocumentProps } from "@react-pdf/renderer"
import type { ReactElement } from "react"
import * as React from "react"
import { FileSearch, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { PdfPreviewDialog } from "@/components/pdf-preview-dialog"
import { Button } from "@/components/ui/button"
import type { ICertificado } from "../certificado.interface"
import { buildCertificadoFileName, isCertificadoDigital } from "../certificados.utils"

export function CertificadoPdfButton({ certificado, iconOnly = false }: { certificado: ICertificado; iconOnly?: boolean }) {
    const [open, setOpen] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [document, setDocument] = React.useState<ReactElement<DocumentProps> | null>(null)

    async function handleOpen() {
        if (isCertificadoDigital(certificado.tipo) && certificado.impreso && certificado.url) {
            window.open(certificado.url, "_blank", "noopener,noreferrer")
            return
        }

        setLoading(true)
        try {
            const { createCertificadoDocument } = await import("./certificado-pdf")
            setDocument(await createCertificadoDocument(certificado))
            setOpen(true)
        } catch (error) {
            console.error(error)
            toast.error("No se pudo generar la vista previa")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Button type="button" variant={iconOnly ? "ghost" : "outline"} size={iconOnly ? "icon" : "default"} onClick={handleOpen} disabled={loading} title="Ver certificado">
                {loading ? <Loader2 className="h-4 w-4 animate-spin text-indigo-600" /> : <FileSearch className="h-4 w-4 text-indigo-600" />}
                {!iconOnly ? (loading ? "Generando..." : "Ver certificado") : null}
            </Button>
            {document ? (
                <PdfPreviewDialog
                    isOpen={open}
                    onOpenChange={setOpen}
                    title={`Certificado ${certificado.numeroRegistro || ""}`}
                    downloadFileName={buildCertificadoFileName(certificado)}
                >
                    {document}
                </PdfPreviewDialog>
            ) : null}
        </>
    )
}
