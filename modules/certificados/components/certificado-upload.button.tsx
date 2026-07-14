"use client"

import * as React from "react"
import { CloudUpload, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import type { ICertificado } from "../certificado.interface"
import { CertificadosService } from "../certificados.service"
import { getCertificadoId, isCertificadoDigital } from "../certificados.utils"

export function CertificadoUploadButton({ certificado, iconOnly = false }: { certificado: ICertificado; iconOnly?: boolean }) {
    const [loading, setLoading] = React.useState(false)
    const router = useRouter()

    async function handleUpload() {
        if (!isCertificadoDigital(certificado.tipo)) {
            toast.error("Los certificados físicos no se almacenan en Drive")
            return
        }
        const id = getCertificadoId(certificado)
        if (!id) return
        setLoading(true)
        try {
            const { createCertificadoPdfFile } = await import("./certificado-pdf")
            await CertificadosService.uploadArchivo(id, await createCertificadoPdfFile(certificado))
            toast.success("PDF digital guardado en Drive")
            router.refresh()
        } catch (error) {
            console.error(error)
            toast.error("No se pudo guardar el PDF en Drive")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button type="button" variant={iconOnly ? "ghost" : "outline"} size={iconOnly ? "icon" : "default"} onClick={handleUpload} disabled={loading} title="Guardar PDF digital en Drive">
            {loading ? <Loader2 className="h-4 w-4 animate-spin text-violet-600" /> : <CloudUpload className="h-4 w-4 text-violet-600" />}
            {!iconOnly ? (loading ? "Subiendo..." : "Guardar PDF en Drive") : null}
        </Button>
    )
}
