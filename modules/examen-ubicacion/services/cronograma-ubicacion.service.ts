import { apiFetch } from "@/services/api.service"
import ICronogramaUbicacion from "../interfaces/cronograma-ubicacion.interface"

export default class CronogramaUbicacionService {
    private static collection = "cronogramaubicacion"

    static async fetchItems(): Promise<ICronogramaUbicacion[]> {
        return await apiFetch<ICronogramaUbicacion[]>(this.collection, "GET")
    }

    static async create(data: Partial<ICronogramaUbicacion>): Promise<ICronogramaUbicacion> {
        return await apiFetch<ICronogramaUbicacion>(this.collection, "POST", data)
    }

    static async update(id: number | string, data: Partial<ICronogramaUbicacion>): Promise<ICronogramaUbicacion> {
        return await apiFetch<ICronogramaUbicacion>(`${this.collection}/${id}`, "PATCH", data)
    }

    static async updateStatus(id: number | string, activo: boolean): Promise<ICronogramaUbicacion> {
        return await apiFetch<ICronogramaUbicacion>(`${this.collection}/${id}`, "PATCH", { activo })
    }

    static async delete(id: number | string): Promise<void> {
        await apiFetch<void>(`${this.collection}/${id}`, "DELETE")
    }
}
