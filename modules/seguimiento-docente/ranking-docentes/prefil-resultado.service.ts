import { apiFetch } from "@/services/api.service";
import { BaseService } from "@/services/base.service";
import { IPerfilResultado } from "./interfaces/perfil-resultado.interface";
import { DetalleResultado } from "./interfaces/detalle-resultado.interface";

export default class PerfilResultadoService extends BaseService {
    protected static collection = 'perfil-docente-resultados'

    static async getItemsByModulo(moduloId: string) {
        const data = await apiFetch<IPerfilResultado[]>(
            `${this.collection}/modulo/${moduloId}`,
            "GET"
        )
        return data
    }

    static async getItemsByDocente(docenteId: string) {
        const data = await apiFetch<IPerfilResultado[]>(
            `${this.collection}/docente/${docenteId}`,
            "GET"
        )
        return data
    }

    static async getItemsByDocenteAndModulo(moduloId: string, docenteId: string) {
        const data = await apiFetch<DetalleResultado>(
            `${this.collection}/detalle/${moduloId}/${docenteId}`,
            "GET"
        )
        return data
    }
}