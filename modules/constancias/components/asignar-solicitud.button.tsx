"use client"

import * as React from "react"
import { toast } from "sonner"
import useOpciones from "@/modules/estructura/hooks/use-opciones"
import type { IEstado } from "@/modules/estructura/interfaces/types.interface"
import { Collection } from "@/modules/estructura/services/opciones.service"
import type { ISolicitud } from "@/modules/solicitudes/shared/solicitud.interface"
import { SolicitudPickerSheet } from "@/modules/solicitudes/shared/solicitud-picker.sheet"
import { findSolicitudEstado } from "@/modules/solicitudes/shared/solicitud-workflow"
import SolicitudesService from "@/modules/solicitudes/shared/solicitudes.service"

interface AsignarSolicitudButtonProps {
    onAsignar: (solicitud: ISolicitud) => void
}

export function AsignarSolicitudButton({ onAsignar }: AsignarSolicitudButtonProps) {
    const { data: estados } = useOpciones<IEstado>(Collection.Estados)
    const estadoAsignada = React.useMemo(
        () => findSolicitudEstado(estados, "asignada", "constancias"),
        [estados]
    )

    async function handleSelect(solicitud: ISolicitud) {
        if (typeof estadoAsignada?.id !== "number") {
            toast.error("No se encontro el estado Asignada para solicitudes")
            throw new Error("Estado Asignada no disponible")
        }

        const updated = await SolicitudesService.update(solicitud.id, { estadoId: estadoAsignada.id })
        if (!updated) throw new Error("No se pudo actualizar la solicitud")
        onAsignar(solicitud)
    }

    return (
        <SolicitudPickerSheet
            endpoint="constancias"
            onSelect={handleSelect}
            triggerLabel="Asignar solicitud"
            title="Solicitudes de constancia pagadas"
        />
    )
}
