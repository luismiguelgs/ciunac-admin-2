import { apiFetch } from "@/services/api.service"
import { IActaExamenUbicacion } from "../interfaces/acta-examen-ubicacion.interface"

export default class ActasExamenUbicacionService {
    private static endpoint = "actasexamenubicacion"

    static async create(examenId: number): Promise<IActaExamenUbicacion> {
        return await apiFetch<IActaExamenUbicacion>(this.endpoint, "POST", { examenId })
    }

    static async getById(id: number | string): Promise<IActaExamenUbicacion> {
        return await apiFetch<IActaExamenUbicacion>(`${this.endpoint}/${id}`, "GET")
    }
}
