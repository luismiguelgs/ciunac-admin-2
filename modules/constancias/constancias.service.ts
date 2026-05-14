import { IConstancia } from "./constancias.interface";
import { BaseService } from "@/services/base.service";
import { apiFetch } from "@/services/api.service";
import { uploadFile } from "@/services/upload.service";


export class ConstanciasService extends BaseService {
    protected static collection = 'constancias';

    /**
     * Función personalizada: Obtiene constancias por estado
     * @param state Estado de la constancia (pendientes, aceptados, impresos)
     */
    static async fetchByState(state: string): Promise<IConstancia[]> {
        return await apiFetch<IConstancia[]>(`${this.collection}/${state.toLowerCase()}`, 'GET');
    }

    /**
     * Sube una constancia en PDF
     * @param file Archivo PDF
     * @param id ID de la constancia
     * @param studentName Nombre del estudiante
     * @param fileId ID del archivo en Drive (opcional para actualizar)
     */
    static async uploadConstancia(file: File, id: string, studentName: string, fileId?: string) {
        return await uploadFile(file, 'constancias', id, studentName, fileId);
    }

    static async procesarFirma(id: string, fileId: string, solicitudId: number) {
        console.log({ id, fileId, solicitudId })
        return await apiFetch<void>(`${this.collection}/procesar-firma`, 'PATCH', {
            constanciaId: id,
            fileId,
            solicitudId
        });
    }

    /**
     * Función personalizada: Actualiza solo el estado de impresión
     */
    static async updateImpreso(id: string, impreso: boolean): Promise<void> {
        return await apiFetch<void>(`${this.collection}/${id}`, 'PATCH', { impreso });
    }
    /**
     * Función personalizada: Ejemplo para aceptar constancia
     */
    static async updateAceptado(id: string, aceptado: boolean): Promise<void> {
        return await apiFetch<void>(`${this.collection}/${id}`, 'PATCH', {
            aceptado,
            fechaAceptacion: aceptado ? new Date() : null
        });
    }
}
