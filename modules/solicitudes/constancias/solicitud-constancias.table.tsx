'use client'

import { SolicitudDataTable } from "../shared/solicitud-data-table"
import type { ISolicitud } from "../shared/solicitud.interface"
import type { SolicitudWorkflowTabState } from "../shared/solicitud-tab-state"

interface SolicitudConstanciasDataTableProps {
    data: ISolicitud[]
    actionMode?: "reject" | "restore"
    returnState?: SolicitudWorkflowTabState
}

export function SolicitudConstanciasDataTable({
    data,
    actionMode = "reject",
    returnState,
}: SolicitudConstanciasDataTableProps) {
    return (
        <SolicitudDataTable
            data={data}
            actionMode={actionMode}
            returnState={returnState}
            basePath="/solicitudes/constancias"
            showTipoColumn
        />
    )
}
