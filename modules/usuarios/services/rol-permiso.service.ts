import { apiFetch, omit } from "@/services/api.service";
import RolPermiso from "@/modules/usuarios/intefaces/rol-permiso.interface";

export default class RolPermisoService {
    static collection = 'rol-permisos';

    private static unwrapList<T>(payload: any): T[] {
        if (Array.isArray(payload)) return payload;
        if (!payload || typeof payload !== "object") return [];

        const list = payload.data ?? payload.items ?? payload.rows ?? payload.results;
        return Array.isArray(list) ? list : [];
    }

    static async fetchItems(): Promise<RolPermiso[]> {
        const data = await apiFetch<RolPermiso[]>(this.collection, 'GET');
        return this.unwrapList(data);
    }

    static async getItem(id: number): Promise<RolPermiso> {
        return await apiFetch<RolPermiso>(`${this.collection}/${id}`, 'GET');
    }

    static async getByRol(rol: string, accessToken?: string): Promise<RolPermiso[]> {
        const url = `${this.collection}/rol/${encodeURIComponent(rol)}`;
        
        // Si hay accessToken, lo usamos directamente (útil en auth.ts)
        if (accessToken) {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const apiKey = process.env.NEXT_PUBLIC_API_KEY;

            const response = await fetch(`${apiUrl}/${url}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": apiKey || "",
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) return [];
            const data = await response.json();
            return this.unwrapList(data);
        }

        const data = await apiFetch<RolPermiso[]>(url, 'GET');
        return this.unwrapList(data);
    }

    static async updateItem(item: RolPermiso): Promise<Omit<RolPermiso, 'id'>> {
        const { id } = item;
        const rest = omit(item, ['id']);
        return await apiFetch<Omit<RolPermiso, 'id'>>(`${this.collection}/${id}`, 'PATCH', rest);
    }

    static async newItem(item: RolPermiso): Promise<Omit<RolPermiso, 'id'>> {
        const rest = omit(item, ['id']);
        return await apiFetch<Omit<RolPermiso, 'id'>>(this.collection, 'POST', rest);
    }

    static async deleteItem(id: number): Promise<void> {
        return await apiFetch<void>(`${this.collection}/${id}`, 'DELETE');
    }
}
