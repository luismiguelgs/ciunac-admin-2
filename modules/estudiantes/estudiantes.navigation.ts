import { studentHref } from "./estudiantes.contract"

export type StudentSearchParams = Promise<Record<string, string | string[] | undefined>>

export async function studentReturnQuery(params: StudentSearchParams) {
    const search = await params
    const result = new URLSearchParams()
    for (const key of ["page", "limit", "search", "tipoEstudiante", "facultadId", "escuelaId", "vinculadoQ10"]) {
        const value = search[key]
        if (typeof value === "string") result.set(key, value)
    }
    return result.toString()
}

export async function studentNavigation(params: StudentSearchParams, id: string) {
    const query = await studentReturnQuery(params)
    return {
        list: studentHref("/estudiantes", query),
        detail: studentHref(`/estudiantes/${id}`, query),
        edit: studentHref(`/estudiantes/${id}/editar`, query),
    }
}
