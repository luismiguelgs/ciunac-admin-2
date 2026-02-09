import { BaseService } from "@/services/base.service";
import { apiFetch } from "@/services/api.service";
import { IEncuestaMetricas } from "../interfaces/encuesta-metricas.interface";
import { IEncuestaRespuesta } from "../interfaces/respuestas.interface";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const apiKey: string = process.env.NEXT_PUBLIC_API_KEY!;

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
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_URL}/encuesta-respuestas/upload`, {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
            },
            credentials: 'include',
            body: formData,
        });

        if (!response.ok) {
            const msg = await response.text();
            throw new Error(`HTTP error! status: ${response.status}: ${msg}`);
        }

        return await response.json();
    }
}