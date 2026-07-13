'use client'

import { SolicitudDataTable } from "../shared/solicitud-data-table"
import { ISolicitud } from "../shared/solicitud.interface"

interface SolicitudUbicacionDataTableProps {
    data: ISolicitud[]
    actionMode?: "reject" | "restore"
}

export function SolicitudUbicacionDataTable({
    data,
    actionMode = "reject"
}: SolicitudUbicacionDataTableProps) {
    return (
        <SolicitudDataTable
            data={data}
            actionMode={actionMode}
            basePath="/solicitudes/ubicacion"
            showTipoColumn={false}
            showNivelColumn
        />
    )
}
