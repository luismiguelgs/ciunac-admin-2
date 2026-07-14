import { apiFetch } from "@/services/api.service"
import type {
    ICertificadoReporteGrupo,
    ICertificadoReporteItem,
    ICertificadoReporteResponse,
} from "./certificado-reporte.interface"

const normalizeItem = (item: ICertificadoReporteItem): ICertificadoReporteItem => ({
    ...item,
    periodo: String(item.periodo ?? "").trim(),
})

const normalizeGroup = (group?: ICertificadoReporteGrupo): ICertificadoReporteGrupo => ({
    digitales: (group?.digitales ?? []).map(normalizeItem),
    fisicos: (group?.fisicos ?? []).map(normalizeItem),
})

export class CertificadoReporteService {
    static async fetchReport(): Promise<ICertificadoReporteResponse> {
        const data = await apiFetch<ICertificadoReporteResponse>("certificadosr", "GET")
        return {
            basico: normalizeGroup(data?.basico),
            intermedioAvanzado: normalizeGroup(data?.intermedioAvanzado),
        }
    }
}
