import { getSession } from "next-auth/react"
import { apiFetch } from "@/services/api.service"
import type { ICertificado, CertificadoPayload } from "./certificado.interface"

const API_URL = process.env.NEXT_PUBLIC_API_URL
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

type CertificadoApiResponse = ICertificado & {
    creado_en?: string | Date
    modificado_en?: string | Date
}

function normalizeCertificado(item: CertificadoApiResponse): ICertificado {
    const { creado_en, modificado_en, ...certificado } = item

    return {
        ...certificado,
        id: certificado.id || certificado._id,
        creadoEn: certificado.creadoEn ?? creado_en,
        modificadoEn: certificado.modificadoEn ?? modificado_en,
    }
}

export class CertificadosService {
    private static collection = "certificados"

    static async fetchBySigned(firmado: boolean): Promise<ICertificado[]> {
        const data = await apiFetch<CertificadoApiResponse[]>(`${this.collection}/impresos?impreso=${firmado}`, "GET")
        return (Array.isArray(data) ? data : []).map(normalizeCertificado)
    }

    static async getItem(id: string): Promise<ICertificado> {
        return normalizeCertificado(await apiFetch<CertificadoApiResponse>(`${this.collection}/${id}`, "GET"))
    }

    static async create(data: CertificadoPayload): Promise<ICertificado> {
        return normalizeCertificado(await apiFetch<CertificadoApiResponse>(this.collection, "POST", data))
    }

    static async update(id: string, data: Partial<CertificadoPayload>): Promise<ICertificado> {
        return normalizeCertificado(await apiFetch<CertificadoApiResponse>(`${this.collection}/${id}`, "PATCH", data))
    }

    static async delete(id: string): Promise<void> {
        await apiFetch<void>(`${this.collection}/${id}`, "DELETE")
    }

    static async uploadArchivo(id: string, file: File): Promise<ICertificado | void> {
        const formData = new FormData()
        formData.append("file", file)

        const session = await getSession()
        const token = (session as { accessToken?: string } | null)?.accessToken
        const response = await fetch(`${API_URL}/${this.collection}/${id}/archivo`, {
            method: "POST",
            body: formData,
            credentials: "include",
            headers: {
                ...(API_KEY ? { "x-api-key": API_KEY } : {}),
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        })

        if (!response.ok) {
            const message = await response.text()
            throw new Error(`No se pudo subir el certificado: ${message}`)
        }

        const text = await response.text()
        return text ? normalizeCertificado(JSON.parse(text) as CertificadoApiResponse) : undefined
    }

    static async procesarFirma(id: string): Promise<void> {
        await apiFetch<void>(`${this.collection}/procesar-firma`, "PATCH", { certificadoId: id })
    }

    static async updateAceptado(id: string, aceptado: boolean): Promise<ICertificado> {
        return this.update(id, {
            aceptado,
            fechaAceptacion: aceptado ? new Date().toISOString() : null,
        })
    }
}
