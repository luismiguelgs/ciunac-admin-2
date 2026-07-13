import { apiFetch } from '@/services/api.service';
import { uploadCSVFile } from '@/services/upload.service';
import { CreateSolicitudPayload, ISolicitud } from './solicitud.interface';

export default class SolicitudesService {
    private static collection = 'solicitudes';

    //Solicitudes por Estado
    public static async fetchItemByState(solicitud: string, state: number): Promise<ISolicitud[]> {
        const response = await apiFetch<ISolicitud[]>(`${this.collection}/${solicitud}?estado=${state}`, 'GET')
        return response
    }

    public static async create(data: CreateSolicitudPayload): Promise<ISolicitud> {
        return apiFetch<ISolicitud>(this.collection, 'POST', data)
    }

    //Eliminar Solicitud
    public static async delete(id: number | string): Promise<unknown> {
        try {
            const response = await apiFetch(`${this.collection}/${id}/rechazo`, 'PATCH');
            return response;
        } catch (error) {
            console.error("Error al rechazar la solicitud:", error);
            return false;
        }
    }

    //Obtener Solicitud por ID
    public static async fetchItemById(id: number | string): Promise<ISolicitud> {
        const response = await apiFetch<ISolicitud>(`${this.collection}/${id}`, 'GET')
        return response
    }

    //Actualizar Solicitud
    public static async update(id: number | string, data: Partial<ISolicitud>): Promise<boolean> {
        try {
            await apiFetch(`${this.collection}/${id}`, 'PATCH', data);
            return true;
        } catch (error) {
            console.error("Error al actualizar la solicitud:", error);
            return false;
        }
    }

    // Importar Pagos Banco
    public static async uploadPagosCSV(file: File): Promise<{ message: string }> {
        const result = await uploadCSVFile<{ message: string }>(file, 'pagos-banco/upload');
        return {
            ...result
        };
    }
}
