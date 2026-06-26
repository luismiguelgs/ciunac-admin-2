import { apiFetch } from "@/services/api.service"
import { IDetalleExamenUbicacion, IExamenUbicacion } from "../interfaces/examen-ubicacion.interface"

export default class ExamenesUbicacionService {
    private static examenes = "examenesubicacion"
    private static detalles = "detallesubicacion"

    static async fetchItems(): Promise<IExamenUbicacion[]> {
        return await apiFetch<IExamenUbicacion[]>(this.examenes, "GET")
    }

    static async getById(id: number | string): Promise<IExamenUbicacion> {
        return await apiFetch<IExamenUbicacion>(`${this.examenes}/${id}`, "GET")
    }

    static async create(data: Partial<IExamenUbicacion>): Promise<IExamenUbicacion> {
        return await apiFetch<IExamenUbicacion>(this.examenes, "POST", data)
    }

    static async update(id: number | string, data: Partial<IExamenUbicacion>): Promise<IExamenUbicacion> {
        return await apiFetch<IExamenUbicacion>(`${this.examenes}/${id}`, "PATCH", data)
    }

    static async updateStatus(id: number | string, estadoId: number): Promise<IExamenUbicacion> {
        return await apiFetch<IExamenUbicacion>(`${this.examenes}/${id}`, "PATCH", { estadoId })
    }

    static async delete(id: number | string): Promise<void> {
        await apiFetch<void>(`${this.examenes}/${id}`, "DELETE")
    }

    static async fetchItemsDetail(examenId?: number | string): Promise<IDetalleExamenUbicacion[]> {
        const url = examenId ? `${this.detalles}/examen/${examenId}` : this.detalles
        return await apiFetch<IDetalleExamenUbicacion[]>(url, "GET")
    }

    static async createDetail(data: Partial<IDetalleExamenUbicacion>): Promise<IDetalleExamenUbicacion> {
        return await apiFetch<IDetalleExamenUbicacion>(this.detalles, "POST", data)
    }

    static async updateDetail(id: number | string, data: Partial<IDetalleExamenUbicacion>): Promise<IDetalleExamenUbicacion> {
        return await apiFetch<IDetalleExamenUbicacion>(`${this.detalles}/${id}`, "PATCH", data)
    }

    static async updateDetailStatus(id: number | string, terminado: boolean): Promise<IDetalleExamenUbicacion> {
        return await apiFetch<IDetalleExamenUbicacion>(`${this.detalles}/${id}`, "PATCH", { terminado })
    }

    static async deleteDetail(id: number | string): Promise<void> {
        await apiFetch<void>(`${this.detalles}/${id}`, "DELETE")
    }
}
