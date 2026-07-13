import { apiFetch } from "@/services/api.service"
import type { IEstudianteSolicitud } from "./solicitud.interface"

export interface UpsertEstudianteSolicitudPayload {
    nombres: string
    apellidos: string
    tipoDocumento: string
    numeroDocumento: string
    celular: string
    facultadId?: number
    escuelaId?: number
    codigo?: string
}

export default class SolicitudEstudiantesService {
    private static collection = "estudiantes"

    static async findByDocument(numeroDocumento: string): Promise<IEstudianteSolicitud | null> {
        return apiFetch<IEstudianteSolicitud | null>(
            `${this.collection}/buscar/${encodeURIComponent(numeroDocumento)}`,
            "GET"
        )
    }

    static async create(data: UpsertEstudianteSolicitudPayload): Promise<IEstudianteSolicitud> {
        return apiFetch<IEstudianteSolicitud>(this.collection, "POST", data)
    }

    static async update(id: string, data: UpsertEstudianteSolicitudPayload): Promise<IEstudianteSolicitud> {
        return apiFetch<IEstudianteSolicitud>(`${this.collection}/${id}`, "PATCH", data)
    }
}
