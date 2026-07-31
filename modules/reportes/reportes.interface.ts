import type { ISolicitud } from "@/modules/solicitudes/shared/solicitud.interface"

export type ReportKind = "documentos" | "examen"

export interface ReportDateRange {
    inicio: string
    fin: string
}

export interface ReportConfig {
    kind: ReportKind
    title: string
    description: string
    apiType: "n" | "7"
    allowedTypeIds: readonly number[]
    exportPrefix: string
}

export type ReportSolicitud = ISolicitud

