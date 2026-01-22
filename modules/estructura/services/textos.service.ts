import { apiFetch } from "@/lib/api.service";
import { ITexto } from "../interfaces/types.interface";

const collection = 'textos'

export default class TextosService {
    static async fetchItems():Promise<ITexto[]>{
        const data = await apiFetch<ITexto[]>(collection, 'GET')
        return data
    }

    static async updateItem(item:ITexto):Promise<ITexto>{
        const data = await apiFetch<ITexto>(`${collection}/${item.id}`, 'PATCH', item)
        return data
    }

    static async newItem(item:ITexto):Promise<ITexto>{
        const data = await apiFetch<ITexto>(collection, 'POST', item)
        return data
    }

    static async deleteItem(id:number):Promise<void>{
        const data = await apiFetch<void>(`${collection}/${id}`, 'DELETE')
        return data
    }
}
