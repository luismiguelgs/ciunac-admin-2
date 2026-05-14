import { BaseService } from "@/services/base.service";
import { apiFetch } from "@/services/api.service";
import { uploadCSVFile } from "@/services/upload.service";
import { IEncuestaMetricas } from "../interfaces/encuesta-metricas.interface";
import { IEncuestaRespuesta } from "../interfaces/respuestas.interface";

export default class EncuestaService extends BaseService {
    protected static collection = 'encuesta-metricas-docente';

    static async getItemsByModulo(moduloId: string): Promise<IEncuestaMetricas[]> {
        const response = await apiFetch<IEncuestaMetricas[]>(`encuesta-metricas-docente?moduloId=${moduloId}`, 'GET');
        return response;
    }

    static async getItemsByDocenteAndModulo(docenteId: string, moduloId: number): Promise<IEncuestaRespuesta[]> {
        const response = await apiFetch<IEncuestaRespuesta[]>(`encuesta-respuestas/buscar?docenteId=${docenteId}&moduloId=${moduloId}`, 'GET');
        return response;
    }

    static async uploadCSV(file: File): Promise<{ message: string; recordsProcessed: number }> {
        const result = await uploadCSVFile<{ message: string; recordsProcessed: number }>(file, 'encuesta-respuestas/upload');
        return {
            ...result
        };
    }
}