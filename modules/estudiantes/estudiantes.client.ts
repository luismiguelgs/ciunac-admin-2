import { apiFailureSchema, type StudentApiFailure } from "./estudiantes.contract"

export class StudentClientError extends Error {
    constructor(public status: number, public failure: StudentApiFailure) {
        super(failure.message)
    }
}

export async function studentApi<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`/api/estudiantes${path}`, { ...init, cache: "no-store" })
    const data: unknown = await response.json().catch(() => undefined)
    if (!response.ok || data === undefined) {
        const failure = apiFailureSchema.safeParse(data)
        throw new StudentClientError(response.status, failure.success ? failure.data : {
            code: "INVALID_RESPONSE",
            message: response.status === 413 ? "El servidor rechazó el tamaño de la solicitud." : "No se pudo completar la operación.",
        })
    }
    return data as T
}

export function studentJson(method: "POST" | "PATCH", payload: object): RequestInit {
    return { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }
}
