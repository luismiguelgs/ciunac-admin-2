import { apiFetch } from "@/services/api.service"
import ICalificacionUbicacion from "../interfaces/calificacion.interface"

export default class CalificacionesUbicacionService {
    private static collection = "calificacionesubicacion"

    static async fetchItems(): Promise<ICalificacionUbicacion[]> {
        return await apiFetch<ICalificacionUbicacion[]>(this.collection, "GET")
    }

    static async create(data: Partial<ICalificacionUbicacion>): Promise<ICalificacionUbicacion> {
        return await apiFetch<ICalificacionUbicacion>(this.collection, "POST", data)
    }

    static async update(id: number | string, data: Partial<ICalificacionUbicacion>): Promise<ICalificacionUbicacion> {
        return await apiFetch<ICalificacionUbicacion>(`${this.collection}/${id}`, "PATCH", data)
    }

    static async delete(id: number | string): Promise<void> {
        await apiFetch<void>(`${this.collection}/${id}`, "DELETE")
    }
}
