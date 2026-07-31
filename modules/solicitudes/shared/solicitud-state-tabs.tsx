import type { ReactNode } from "react"
import { UrlStateTabs } from "@/components/url-state-tabs"
import type { ISolicitud } from "./solicitud.interface"
import {
    SOLICITUD_STATE_QUERY_PARAM,
    type SolicitudWorkflowTabState,
} from "./solicitud-tab-state"
import type { SolicitudWorkflowData } from "./solicitud-workflow"

type SolicitudActionMode = "reject" | "restore"

interface SolicitudStateTabsProps {
    data: SolicitudWorkflowData
    activeState: SolicitudWorkflowTabState
    renderTable: (
        items: ISolicitud[],
        actionMode: SolicitudActionMode | undefined,
        returnState: SolicitudWorkflowTabState,
    ) => ReactNode
}

export function SolicitudStateTabs({
    data,
    activeState,
    renderTable,
}: SolicitudStateTabsProps) {
    return (
        <UrlStateTabs
            activeValue={activeState}
            queryParam={SOLICITUD_STATE_QUERY_PARAM}
            items={[
                {
                    value: "nuevas",
                    label: `Nuevas (${data.nuevas.length})`,
                    content: renderTable(data.nuevas, undefined, "nuevas"),
                },
                {
                    value: "pagadas",
                    label: `Pagadas (${data.pagadas.length})`,
                    content: renderTable(data.pagadas, undefined, "pagadas"),
                },
                {
                    value: "asignadas",
                    label: `Asignadas (${data.asignadas.length})`,
                    content: renderTable(data.asignadas, undefined, "asignadas"),
                },
                {
                    value: "finalizadas",
                    label: `Finalizadas (${data.finalizadas.length})`,
                    content: renderTable(data.finalizadas, undefined, "finalizadas"),
                },
                {
                    value: "observadas",
                    label: `Observadas (${data.observadas.length})`,
                    content: renderTable(data.observadas, undefined, "observadas"),
                },
                {
                    value: "rechazadas",
                    label: `Rechazadas (${data.rechazadas.length})`,
                    content: renderTable(data.rechazadas, "restore", "rechazadas"),
                },
            ]}
        />
    )
}
