import { apiFetch } from "@/services/api.service"
import { REPORT_CONFIGS } from "./reportes.constants"
import type { ReportDateRange, ReportKind, ReportSolicitud } from "./reportes.interface"
import { filterReportSolicitudes } from "./reportes.utils"

export class ReportesService {
    private static readonly collection = "solicitudes/reporte-fechas"

    static async fetchByDate(kind: ReportKind, range: ReportDateRange): Promise<ReportSolicitud[]> {
        const config = REPORT_CONFIGS[kind]
        const query = new URLSearchParams({
            inicio: range.inicio,
            fin: range.fin,
            tipo: config.apiType,
        })
        const solicitudes = await apiFetch<ReportSolicitud[]>(`${this.collection}?${query.toString()}`, "GET")

        return filterReportSolicitudes(solicitudes, config.allowedTypeIds)
    }
}

