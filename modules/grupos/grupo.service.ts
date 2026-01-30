import { ICursoQ10 } from "./interfaces/cursoq10.interface";
import { IGrupo } from "./interfaces/grupo.interface";
import { apiFetch } from "@/lib/api.service";

export default class GrupoService {
    private static collection = 'grupos'

    static async fetchItems(): Promise<IGrupo[]> {
        const response = await apiFetch<IGrupo[]>(this.collection, 'GET');
        return response;
    }

    static async getItem(id: number): Promise<IGrupo> {
        const response = await apiFetch<IGrupo>(`${this.collection}/${id}`, 'GET');
        return response;
    }

    static async updateItem(item: IGrupo): Promise<IGrupo> {
        console.log(item);
        const { id, ...rest } = item;
        const response = await apiFetch<IGrupo>(`${this.collection}/${id}`, 'PATCH', rest);
        return response;
    }

    static async deleteItem(id: number): Promise<void> {
        const response = await apiFetch<void>(`${this.collection}/${id}`, 'DELETE');
        return response;
    }

    static async newItem(item: IGrupo): Promise<IGrupo> {
        const response = await apiFetch<IGrupo>(this.collection, 'POST', item);
        return response;
    }

    static async getImportItems(periodo: string): Promise<ICursoQ10[]> {
        const response = await apiFetch<ICursoQ10[]>(`q10/horarios-cursos?periodo=${periodo}`, 'GET');
        return response;
    }

    static async importItems(periodo: number, nombrePeriodo: string): Promise<void> {
        const response = await apiFetch<void>(`q10/horarios-cursos`, 'POST', { periodo, nombrePeriodo });
        return response;
    }
}