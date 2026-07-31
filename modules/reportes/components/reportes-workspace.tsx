import { UrlStateTabs } from "@/components/url-state-tabs"
import { REPORT_CONFIGS } from "../reportes.constants"
import type { ReportKind } from "../reportes.interface"
import { ReportePanel } from "./reporte-panel"

export function ReportesWorkspace({ activeReport }: { activeReport: ReportKind }) {
    return (
        <UrlStateTabs
            activeValue={activeReport}
            queryParam="reporte"
            items={[
                {
                    value: "documentos",
                    label: "Certificados y constancias",
                    content: <ReportePanel config={REPORT_CONFIGS.documentos} />,
                },
                {
                    value: "examen",
                    label: "Examen de ubicación",
                    content: <ReportePanel config={REPORT_CONFIGS.examen} />,
                },
            ]}
        />
    )
}

