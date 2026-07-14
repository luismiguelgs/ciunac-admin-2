'use client'

import { SolicitudDataTable } from "../shared/solicitud-data-table"
import type { ISolicitud } from "../shared/solicitud.interface"

interface SolicitudCertificadosDataTableProps {
    data: ISolicitud[]
    actionMode?: "reject" | "restore"
}

export function SolicitudCertificadosDataTable({
    data,
    actionMode = "reject",
}: SolicitudCertificadosDataTableProps) {
    return (
        <SolicitudDataTable
            data={data}
            actionMode={actionMode}
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
