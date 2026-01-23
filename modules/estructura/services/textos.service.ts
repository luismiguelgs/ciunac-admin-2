import { apiFetch } from "@/lib/api.service";
import { ITexto } from "../interfaces/types.interface";
import { omit } from "@/lib/api.service";

const collection = 'textos'

export default class TextosService {
    static async fetchItems(): Promise<ITexto[]> {
        const data = await apiFetch<ITexto[]>(collection, 'GET')
        return data
    }

    static async updateItem(item: ITexto): Promise<ITexto> {
        const { id } = item;
        const rest = omit(item as any, ['id', '_id', 'creadoEn', 'modificadoEn', 'creado_en', 'modificado_en', '__v']);
        const data = await apiFetch<ITexto>(`${collection}/${id}`, 'PATCH', rest)
        return data
    }

    static async newItem(item: ITexto): Promise<ITexto> {
        const rest = omit(item as any, ['id', '_id', 'creadoEn', 'modificadoEn', 'creado_en', 'modificado_en', '__v', 'isNew']);
        const data = await apiFetch<ITexto>(collection, 'POST', rest)
        return data
    }

    static async deleteItem(id: any): Promise<void> {
        const data = await apiFetch<void>(`${collection}/${id}`, 'DELETE')
        return data
    }
}
