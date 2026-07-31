'use client'

import { SolicitudDataTable } from "../shared/solicitud-data-table"
import { ISolicitud } from "../shared/solicitud.interface"
import type { SolicitudWorkflowTabState } from "../shared/solicitud-tab-state"

interface SolicitudUbicacionDataTableProps {
    data: ISolicitud[]
    actionMode?: "reject" | "restore"
    returnState?: SolicitudWorkflowTabState
}

export function SolicitudUbicacionDataTable({
    data,
    actionMode = "reject",
    returnState,
}: SolicitudUbicacionDataTableProps) {
    return (
        <SolicitudDataTable
            data={data}
            actionMode={actionMode}
            returnState={returnState}
            basePath="/solicitudes/ubicacion"
            showTipoColumn={false}
            showNivelColumn
            showFechaColumn
            searchByDocument
            searchPlaceholder="Buscar por nombres, apellidos o DNI..."
            fechaColumnHeader="Fecha de ingreso"
        />
    )
}
