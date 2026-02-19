import { apiFetch } from "@/services/api.service";
import { BaseService } from "@/services/base.service";
import { IPerfilResultado } from "./perfil-resultado.interface";

export default class PerfilResultadoService extends BaseService {
    protected static collection = 'perfil-docente-resultados'

    static async getItemsByModulo(moduloId: string) {
        const data = await apiFetch<IPerfilResultado[]>(
            `${this.collection}/modulo/${moduloId}`,
            "GET"
        )
        return data
    }
}