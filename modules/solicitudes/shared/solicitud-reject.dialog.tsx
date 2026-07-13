'use client'

import React from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import useOpciones from "@/modules/estructura/hooks/use-opciones"
import { IEstado } from "@/modules/estructura/interfaces/types.interface"
import { Collection } from "@/modules/estructura/services/opciones.service"
import { ISolicitud } from "./solicitud.interface"
import SolicitudesService from "./solicitudes.service"
import { findSolicitudEstado } from "./solicitud-workflow"

interface SolicitudRejectDialogProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    solicitud: ISolicitud | null
    onRejected: () => void
}

const REJECTION_REASON_OTHER = "otro"
const REJECTION_REASONS = [
    {
        value: "voucher-incorrecto",
        label: "Numero de voucher incorrecto o incompleto",
        text: "El numero de voucher consignado es incorrecto o incompleto.\nRecuerde que el numero de operacion debe contar con 15 digitos y coincidir exactamente con el comprobante adjunto."
    },
    {
        value: "fecha-no-corresponde",
        label: "Fecha de efectividad no corresponde",
        text: "La fecha de efectividad registrada no corresponde al voucher adjunto.\nVerifique la fecha correcta ubicada en la parte superior del comprobante de pago."
    },
    {
        value: "monto-no-coincide",
        label: "Monto no coincide",
        text: "El monto consignado en la solicitud no coincide con el voucher adjunto.\nRevise que el importe registrado sea exactamente igual al que figura en el comprobante."
    },
    {
        value: "voucher-no-legible",
        label: "Voucher sin nitidez",
        text: "El voucher adjunto carece de nitidez o no permite validar la informacion.\nAdjunte un comprobante legible y completo."
    },
    {
        value: "voucher-otro-usuario",
        label: "Voucher de otro usuario",
        text: "El voucher adjunto pertenece a otro usuario.\nDebe adjuntar el comprobante que corresponda a su nombre o numero de DNI."
    },
]

export function SolicitudRejectDialog({
    isOpen,
    onOpenChange,
    solicitud,
    onRejected
}: SolicitudRejectDialogProps) {
    const { data: estados } = useOpciones<IEstado>(Collection.Estados)
    const [selectedReason, setSelectedReason] = React.useState("")
    const [customReason, setCustomReason] = React.useState("")
    const [isRejecting, setIsRejecting] = React.useState(false)

    const rejectedEstado = React.useMemo(() => findSolicitudEstado(estados, "rechazada"), [estados])

    const selectedReasonText = React.useMemo(() => {
        return REJECTION_REASONS.find(reason => reason.value === selectedReason)?.text || ""
    }, [selectedReason])

    const rejectionObservation = selectedReason === REJECTION_REASON_OTHER ? customReason.trim() : selectedReasonText
    const canReject = Boolean(solicitud && rejectedEstado?.id && rejectionObservation.trim() && !isRejecting)

    const reset = React.useCallback(() => {
        setSelectedReason("")
        setCustomReason("")
        setIsRejecting(false)
    }, [])

    const handleOpenChange = (open: boolean) => {
        onOpenChange(open)
        if (!open) {
            reset()
        }
    }

    const handleReject = async () => {
        if (!solicitud || !rejectedEstado?.id || !rejectionObservation.trim()) {
            toast.error("Seleccione un motivo de rechazo")
            return
        }

        setIsRejecting(true)

        const success = await SolicitudesService.update(solicitud.id, {
            estadoId: rejectedEstado.id,
            observaciones: rejectionObservation.trim(),
        })

        if (success) {
            toast.success("Solicitud rechazada correctamente")
            handleOpenChange(false)
            onRejected()
        } else {
            toast.error("Error al rechazar la solicitud")
            setIsRejecting(false)
        }
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
            <AlertDialogContent className="sm:max-w-xl">
                <AlertDialogHeader>
                    <AlertDialogTitle>Rechazar solicitud</AlertDialogTitle>
                    <AlertDialogDescription>
                        Seleccione el motivo por el que la solicitud de {solicitud?.estudiante?.nombres} {solicitud?.estudiante?.apellidos} no procede.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="reject-reason">Motivo del rechazo</Label>
                        <Select value={selectedReason} onValueChange={setSelectedReason}>
                            <SelectTrigger id="reject-reason" className="w-full">
                                <SelectValue placeholder="Seleccionar motivo..." />
                            </SelectTrigger>
                            <SelectContent>
                                {REJECTION_REASONS.map(reason => (
                                    <SelectItem key={reason.value} value={reason.value}>
                                        {reason.label}
                                    </SelectItem>
                                ))}
                                <SelectItem value={REJECTION_REASON_OTHER}>
                                    Otro motivo
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {selectedReason && selectedReason !== REJECTION_REASON_OTHER ? (
                        <div className="rounded-md border bg-muted/30 p-3 text-sm whitespace-pre-line">
                            {selectedReasonText}
                        </div>
                    ) : null}

                    {selectedReason === REJECTION_REASON_OTHER ? (
                        <div className="space-y-2">
                            <Label htmlFor="custom-reject-reason">Detalle del motivo</Label>
                            <Textarea
                                id="custom-reject-reason"
                                value={customReason}
                                onChange={(event) => setCustomReason(event.target.value)}
                                placeholder="Ingrese el motivo de rechazo..."
                                rows={3}
                                className="h-20 min-h-20 resize-none"
                            />
                        </div>
                    ) : null}

                    {!rejectedEstado ? (
                        <p className="text-sm font-medium text-destructive">
                            No se encontro el estado Rechazado para solicitudes.
                        </p>
                    ) : null}
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isRejecting}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={!canReject}
                        onClick={(event) => {
                            event.preventDefault()
                            handleReject()
                        }}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {isRejecting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Rechazando
                            </>
                        ) : (
                            "Rechazar solicitud"
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
