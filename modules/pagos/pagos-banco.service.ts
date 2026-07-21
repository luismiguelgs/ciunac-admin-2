import { apiFetch } from "@/services/api.service"
import { uploadCSVFile } from "@/services/upload.service"
import type { IPagoBanco, IPagosBancoUploadResult } from "./pago-banco.interface"

interface RawPagosBancoUploadResult {
    message?: string
    mensaje?: string
    resumen?: Record<string, number>
}

export class PagosBancoService {
    private static readonly collection = "pagos-banco"

    static async fetchByPeriodo(periodo: string): Promise<IPagoBanco[]> {
        if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(periodo)) {
            throw new Error("El periodo debe tener el formato YYYY-MM")
        }

        const data = await apiFetch<IPagoBanco[]>(
            `${this.collection}?periodo=${encodeURIComponent(periodo)}`,
            "GET"
        )
        return Array.isArray(data) ? data : []
    }

    static async uploadPagosCSV(file: File): Promise<IPagosBancoUploadResult> {
        const result = await uploadCSVFile<RawPagosBancoUploadResult>(file, `${this.collection}/upload`)
        return {
            message: result.message || result.mensaje || "El archivo fue procesado correctamente.",
            resumen: result.resumen,
        }
    }

    static async setVerificado(id: number, verificado: boolean): Promise<IPagoBanco> {
        return apiFetch<IPagoBanco>(`${this.collection}/${id}`, "PATCH", { verificado })
    }
}
