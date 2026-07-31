import type { ReportConfig, ReportKind } from "./reportes.interface"

export const REPORT_CONFIGS: Record<ReportKind, ReportConfig> = {
    documentos: {
        kind: "documentos",
        title: "Certificados y constancias",
        description: "Solicitudes documentarias registradas dentro del rango seleccionado.",
        apiType: "n",
        allowedTypeIds: [1, 2, 3, 4, 5, 6],
        exportPrefix: "reporte-documentos",
    },
    examen: {
        kind: "examen",
        title: "Examen de ubicación",
        description: "Solicitudes de examen de ubicación registradas dentro del rango seleccionado.",
        apiType: "7",
        allowedTypeIds: [7],
        exportPrefix: "reporte-examen-ubicacion",
    },
}

