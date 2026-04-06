import { apiFetch } from "@/services/api.service";
import ISolicitudBeca from "./solicitud-becas.interface";
import { obtenerPeriodo } from "@/lib/utils";

import { BaseService } from "@/services/base.service";

export default class SolicitudbecasService extends BaseService {
    protected static collection = 'solicitudbecas';

    /**
     * Guarda una nueva solicitud de beca.
     * @param data Datos de la solicitud de beca.
     * @returns El ID de la solicitud creada o undefined en caso de error.
     */
    public static async create(data: ISolicitudBeca): Promise<string | undefined> {
        const solicitudData = {
            ...data,
            apellidos: data.apellidos.toLocaleUpperCase(),
            nombres: data.nombres.toLocaleUpperCase(),
            direccion: data.direccion.toLocaleUpperCase(),
            periodo: obtenerPeriodo(),
        };

        try {
            const response = await apiFetch<ISolicitudBeca>(this.collection, 'POST', solicitudData);
            return response?._id;
        } catch (error) {
            console.error("Error al crear la solicitud de beca:", error);
            return undefined;
        }
    }

    /**
     * Obtiene todas las solicitudes de becas.
     * @returns Array de solicitudes de becas.
     */
    public static async getAll(): Promise<ISolicitudBeca[]> {
        const response = await apiFetch<ISolicitudBeca[]>(this.collection, 'GET');
        return response;
    }

    /**
     * Busca solicitudes de beca por el número de documento (DNI).
     * @param dni Número de documento.
     * @returns Array de solicitudes encontradas.
     */
    public static async getByDni(dni: string): Promise<ISolicitudBeca[]> {
        const response = await apiFetch<ISolicitudBeca[]>(`${this.collection}/documento/${dni}`, 'GET');
        return response;
    }

    /**
     * Obtiene una solicitud de beca por su ID.
     * @param id ID de la solicitud.
     * @returns La solicitud encontrada.
     */
    public static async getById(id: string): Promise<ISolicitudBeca> {
        const response = await apiFetch<ISolicitudBeca>(`${this.collection}/${id}`, 'GET');
        return response;
    }

    public static async update(id: string, data: Partial<ISolicitudBeca>): Promise<boolean> {
        try {
            await apiFetch<ISolicitudBeca>(`${this.collection}/${id}`, 'PATCH', data);
            return true;
        } catch (error) {
            console.error("Error al actualizar la solicitud de beca:", error);
            return false;
        }
    }

    public static async delete(id: string): Promise<boolean> {
        try {
            await apiFetch<ISolicitudBeca>(`${this.collection}/${id}`, 'DELETE');
            return true;
        } catch (error) {
            console.error("Error al eliminar la solicitud de beca:", error);
            return false;
        }
    }
}
