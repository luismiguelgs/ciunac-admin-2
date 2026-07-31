'use client'

import { SolicitudDataTable } from "../shared/solicitud-data-table"
import type { ISolicitud } from "../shared/solicitud.interface"
import type { SolicitudWorkflowTabState } from "../shared/solicitud-tab-state"

interface SolicitudCertificadosDataTableProps {
    data: ISolicitud[]
    actionMode?: "reject" | "restore"
    returnState?: SolicitudWorkflowTabState
}

export function SolicitudCertificadosDataTable({
    data,
    actionMode = "reject",
    returnState,
}: SolicitudCertificadosDataTableProps) {
    return (
        <SolicitudDataTable
            data={data}
            actionMode={actionMode}
            returnState={returnState}
            basePath="/solicitudes/certificados"
            showTipoColumn
            showFormatoColumn
            showNivelColumn
            showOnlineColumn
            showFechaColumn
            showPagoColumn={false}
            pageSize={20}
            compact
            searchByDocument
        />
    )
}
