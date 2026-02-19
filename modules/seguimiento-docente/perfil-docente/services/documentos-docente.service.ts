import { apiFetch } from "@/services/api.service";
import { BaseService } from "@/services/base.service";
import DocumentosPerfil from "../interfaces/documentos-perfil.interface";

export default class DocumentosDocenteService extends BaseService {
    protected static collection = 'documentos-docente'

    static async getDocuments(perfilId: string) {
        return await apiFetch<DocumentosPerfil[]>(`documentos-docente/perfil/${perfilId}`, 'GET');
    }
}