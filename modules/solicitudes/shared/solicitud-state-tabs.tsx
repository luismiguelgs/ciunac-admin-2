import type { ReactNode } from "react"
import MyTabs from "@/components/my-tabs"
import type { ISolicitud } from "./solicitud.interface"
import type { SolicitudWorkflowData } from "./solicitud-workflow"

type SolicitudActionMode = "reject" | "restore"

interface SolicitudStateTabsProps {
    data: SolicitudWorkflowData
    renderTable: (items: ISolicitud[], actionMode?: SolicitudActionMode) => ReactNode
}

export function SolicitudStateTabs({ data, renderTable }: SolicitudStateTabsProps) {
    return (
        <MyTabs
            defaultValue="nuevas"
            items={[
                {
                    value: "nuevas",
                    label: `Nuevas (${data.nuevas.length})`,
                    content: renderTable(data.nuevas),
                },
                {
                    value: "pagadas",
                    label: `Pagadas (${data.pagadas.length})`,
                    content: renderTable(data.pagadas),
                },
                {
                    value: "asignadas",
                    label: `Asignadas (${data.asignadas.length})`,
                    content: renderTable(data.asignadas),
                },
                {
                    value: "finalizadas",
                    label: `Finalizadas (${data.finalizadas.length})`,
                    content: renderTable(data.finalizadas),
                },
                {
                    value: "observadas",
                    label: `Observadas (${data.observadas.length})`,
                    content: renderTable(data.observadas),
                },
                {
                    value: "rechazadas",
                    label: `Rechazadas (${data.rechazadas.length})`,
                    content: renderTable(data.rechazadas, "restore"),
                },
            ]}
        />
    )
}
