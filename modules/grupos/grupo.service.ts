import { ICursoQ10 } from "./interfaces/cursoq10.interface";
import { apiFetch } from "@/services/api.service";
import { BaseService } from "@/services/base.service";

export default class GrupoService extends BaseService {
    protected static collection = 'grupos'

    static async getImportItems(periodo: string): Promise<ICursoQ10[]> {
        const response = await apiFetch<ICursoQ10[]>(`q10/horarios-cursos?periodo=${periodo}`, 'GET');
        return response;
    }

    static async importItems(periodo: number, nombrePeriodo: string): Promise<void> {
        const response = await apiFetch<void>(`q10/horarios-cursos`, 'POST', { periodo, nombrePeriodo });
        return response;
    }
}