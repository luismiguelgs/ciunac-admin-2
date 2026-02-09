import { apiFetch } from "@/services/api.service";
import { BaseService } from "@/services/base.service";
import { ICumplimientoDocente } from "./cumplimiento.interface";

export default class CumplimientoService extends BaseService {
    protected static collection = 'cumplimiento-docente'

    static async getItemsAcadAdminPeriodo(moduloId: string, academicoAdministrativoId: string) {
        const data = await apiFetch<ICumplimientoDocente[]>(
            `${this.collection}?academicoAdministrativoId=${academicoAdministrativoId}&moduloId=${moduloId}`,
            "GET"
        )
        return data
    }
}