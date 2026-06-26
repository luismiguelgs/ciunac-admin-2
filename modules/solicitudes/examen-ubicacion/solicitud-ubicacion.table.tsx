'use client'

import { SolicitudConstanciasDataTable } from "../constancias/solicitud-constancias.table"
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
        <SolicitudConstanciasDataTable
            data={data}
            actionMode={actionMode}
            basePath="/solicitudes/ubicacion"
            showTipoColumn={false}
            showNivelColumn
        />
    )
}
