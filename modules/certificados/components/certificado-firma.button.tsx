"use client"

import * as React from "react"
import { FileSignature, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import useOpciones from "@/modules/estructura/hooks/use-opciones"
import type { IEstado } from "@/modules/estructura/interfaces/types.interface"
import { Collection } from "@/modules/estructura/services/opciones.service"
import { findSolicitudEstado } from "@/modules/solicitudes/shared/solicitud-workflow"
import SolicitudesService from "@/modules/solicitudes/shared/solicitudes.service"
import type { ICertificado } from "../certificado.interface"
import { CertificadosService } from "../certificados.service"
import { getCertificadoId, isCertificadoDigital } from "../certificados.utils"

export function CertificadoFirmaButton({ certificado, iconOnly = false, onComplete }: { certificado: ICertificado; iconOnly?: boolean; onComplete?: () => void }) {
    const [open, setOpen] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const router = useRouter()
    const digital = isCertificadoDigital(certificado.tipo)
    const { data: estados } = useOpciones<IEstado>(Collection.Estados)
    const estadoFinalizada = React.useMemo(() => findSolicitudEstado(estados, "finalizada"), [estados])

    async function handleConfirm() {
        const id = getCertificadoId(certificado)
        if (!id) return
        setLoading(true)
        try {
            if (digital) {
                if (!certificado.url && !certificado.driveId) throw new Error("El certificado digital no tiene un archivo en Drive")
                await CertificadosService.procesarFirma(id)
            } else {
                if (typeof estadoFinalizada?.id !== "number") throw new Error("No se encontro el estado Finalizada")
                await CertificadosService.update(id, { impreso: true })
                const updated = await SolicitudesService.update(certificado.solicitudId, { estadoId: estadoFinalizada.id })
                if (!updated) {
                    await CertificadosService.update(id, { impreso: false })
                    throw new Error("No se pudo finalizar la solicitud; el certificado fue revertido")
                }
            }
            toast.success(digital ? "Firma digital procesada" : "Certificado marcado como firmado")
            setOpen(false)
            onComplete?.()
            router.refresh()
        } catch (error) {
            console.error(error)
            toast.error(error instanceof Error ? error.message : "No se pudo completar la firma")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Button type="button" variant={iconOnly ? "ghost" : "default"} size={iconOnly ? "icon" : "default"} onClick={() => setOpen(true)} title={digital ? "Procesar firma digital" : "Marcar como firmado"}>
                <FileSignature className={digital ? "h-4 w-4 text-emerald-600" : "h-4 w-4 text-amber-600"} />
                {!iconOnly ? (digital ? "Procesar firma" : "Marcar como firmado") : null}
            </Button>
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{digital ? "Procesar firma digital" : "Confirmar firma del certificado"}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {digital
                                ? "El backend firmara el PDF almacenado en Drive y finalizara la solicitud asociada."
                                : "Confirme que el certificado físico ya fue firmado. Esta acción finalizará la solicitud asociada."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction disabled={loading} onClick={event => { event.preventDefault(); handleConfirm() }}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}Confirmar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
