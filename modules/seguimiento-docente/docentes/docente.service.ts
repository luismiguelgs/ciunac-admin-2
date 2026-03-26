import { BaseService } from '@/services/base.service';
import { IDocente } from './docente.interface';
import { apiFetch } from '@/services/api.service';

export default class DocentesService extends BaseService {

    protected static collection = 'docentes'

    static async getDocenteByUserId(userId: string): Promise<IDocente> {
        const response = await apiFetch<any>(`${this.collection}/usuario/${userId}`, 'GET')
        const data = response?.data ?? response
        
        if (!data?.id) {
            console.error('Docente not found or invalid response structure', response)
        }
        
        return data as IDocente
    }
}