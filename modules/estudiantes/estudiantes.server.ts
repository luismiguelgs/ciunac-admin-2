import "server-only"

import { randomUUID } from "node:crypto"
import { z } from "zod"
import { Collection } from "@/modules/estructura/services/opciones.service"
import {
    apiFailureSchema, documentUrl, facultySchema, registrationSuccessSchema,
    schoolSchema, studentDetailSchema, studentPageSchema,
    type Q10Payload, type StudentApiFailure, type StudentPatch,
} from "./estudiantes.contract"

export class StudentRequestError extends Error {
    constructor(public status: number, public failure: StudentApiFailure) {
        super(failure.message)
    }
}

export function studentError(status: number, code: string, message: string) {
    return new StudentRequestError(status, { code, message })
}

const q10Messages: Record<string, string> = {
    Q10_INVALID_JSON: "No se pudo interpretar la solicitud de alta.",
    Q10_REQUEST_VALIDATION_FAILED: "Revise los campos indicados antes de confirmar nuevamente.",
    Q10_LOCAL_VALIDATION_FAILED: "Revise los datos académicos y la vigencia de los catálogos.",
    Q10_STUDENT_CREATION_REJECTED: "Q10 rechazó el registro. Revise el caso con soporte antes de iniciar otra alta.",
    Q10_UNAUTHORIZED: "La integración con CIUNAC no está autorizada.",
    Q10_REQUEST_TOO_LARGE: "La solicitud supera el tamaño permitido.",
    Q10_ID_CONFLICT: "Q10 devolvió un identificador en conflicto. Consulte con soporte.",
    Q10_ID_ALREADY_LINKED: "El identificador de Q10 ya está vinculado. Consulte con soporte.",
    Q10_PERIOD_LOOKUP_FAILED: "No se pudo consultar el periodo de Q10. Revise la integración con soporte.",
    Q10_UNAVAILABLE: "No se pudo confirmar el resultado en Q10. Consulte con soporte.",
    Q10_CREATED_INVALID_RESPONSE: "Q10 respondió sin un identificador utilizable. Consulte con soporte.",
    Q10_CREATED_LOCAL_SYNC_FAILED: "Q10 creó al alumno, pero no se pudo sincronizar su ficha local.",
    Q10_CREATED_PROGRAM_PENDING: "El alumno fue creado. Su matrícula en el programa queda pendiente de confirmación.",
    Q10_INTERNAL_ERROR: "No se pudo confirmar el resultado del alta. Consulte con soporte.",
}

async function requestCiunac(path: string, options?: { method: string; body: FormData | object; operationId?: string }) {
    const base = process.env.API_URL?.trim() || process.env.NEXT_PUBLIC_API_URL?.trim()
    const key = process.env.API_KEY?.trim()
    if (!base || !key) throw studentError(503, "CIUNAC_CONFIGURATION", "Falta configurar la integración privada con CIUNAC.")

    const headers = new Headers({ "x-api-key": key })
    if (options?.operationId) headers.set("X-Correlation-Id", options.operationId)
    const multipart = options?.body instanceof FormData
    if (options && !multipart) headers.set("Content-Type", "application/json")
    try {
        const response = await fetch(`${base.replace(/\/+$/, "")}/${path}`, {
            method: options?.method ?? "GET",
            body: multipart ? options.body as FormData : options ? JSON.stringify(options.body) : undefined,
            headers,
            cache: "no-store",
            redirect: "error",
        })
        const body = await response.text()
        let data: unknown = null
        if (body.trim()) {
            try {
                data = JSON.parse(body)
            } catch {
                if (response.ok) throw studentError(502, "INVALID_RESPONSE", "CIUNAC devolvió una respuesta inválida.")
            }
        }
        if (!response.ok) {
            const parsed = apiFailureSchema.safeParse(data)
            if (options?.operationId && parsed.success && Object.hasOwn(q10Messages, parsed.data.code)) {
                throw new StudentRequestError(response.status, {
                    ...parsed.data,
                    message: q10Messages[parsed.data.code],
                    operationId: parsed.data.operationId ?? options.operationId,
                    retryAllowed: false,
                })
            }
            if (options?.operationId) {
                throw new StudentRequestError(response.status, {
                    code: "Q10_RESULT_UNCERTAIN",
                    message: "No se pudo confirmar el resultado del alta. Consulte con soporte.",
                    operationId: options.operationId,
                    retryAllowed: false,
                })
            }
            if (response.status === 401 || response.status === 403) {
                throw studentError(502, "CIUNAC_UNAUTHORIZED", "CIUNAC rechazó la credencial de la integración.")
            }
            throw studentError(response.status, "CIUNAC_ERROR",
                response.status === 400 ? "CIUNAC rechazó los datos de la operación." : "No se pudo completar la operación en CIUNAC.")
        }
        return { data, status: response.status, operationId: response.headers.get("X-Operation-Id") }
    } catch (error) {
        if (error instanceof StudentRequestError && (!options?.operationId || error.failure.operationId)) throw error
        if (options?.operationId) {
            throw new StudentRequestError(502, {
                code: "Q10_RESULT_UNCERTAIN",
                message: "No se pudo confirmar el resultado del alta. Consulte con soporte.",
                operationId: options.operationId,
                retryAllowed: false,
            })
        }
        throw studentError(502, "CIUNAC_UNAVAILABLE", "No se pudo consultar CIUNAC.")
    }
}

export async function listStudents(query: Record<string, string | number | undefined>) {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(query)) {
        if (value !== undefined && value !== "") params.set(key, String(value))
    }
    const { data } = await requestCiunac(`estudiantes?${params}`)
    return studentPageSchema.parse(data)
}

export async function getStudent(id: string) {
    const { data } = await requestCiunac(`estudiantes/${encodeURIComponent(id)}`)
    return data === null ? null : studentDetailSchema.parse(data)
}

export async function findStudentDocument(number: string) {
    const { data } = await requestCiunac(`estudiantes/buscar/${encodeURIComponent(number)}`)
    return data === null ? null : studentDetailSchema.parse(data)
}

export async function updateStudent(id: string, patch: StudentPatch) {
    const { data } = await requestCiunac(`estudiantes/${encodeURIComponent(id)}`, { method: "PATCH", body: patch })
    return data === null ? null : studentDetailSchema.parse(data)
}

export async function getStudentCatalogs() {
    const [facultades, escuelas] = await Promise.all([
        requestCiunac(Collection.Facultades),
        requestCiunac(Collection.Escuelas),
    ])
    return { faculties: z.array(facultySchema).parse(facultades.data), schools: z.array(schoolSchema).parse(escuelas.data) }
}

const programList = z.array(z.object({
    Codigo: z.string().trim().min(1),
    Nombre: z.string().trim().min(1),
    Numero_resolucion: z.string().nullable(),
}))

export async function getStudentPrograms() {
    const key = process.env.API_KEY_Q10?.trim()
    if (!key) throw studentError(503, "Q10_CATALOG_CONFIGURATION", "Falta configurar la consulta privada de programas Q10.")

    const base = process.env.Q10_API_URL?.trim() || "https://api.q10.com/v1"
    const response = await fetch(`${base.replace(/\/+$/, "")}/programas?Limit=30`, {
        headers: { "Api-Key": key },
        cache: "no-store",
        redirect: "error",
    }).catch(() => null)
    if (!response?.ok) throw studentError(502, "Q10_CATALOG_UNAVAILABLE", "No se pudieron consultar los programas Q10.")

    const parsed = programList.safeParse(await response.json().catch(() => null))
    if (!parsed.success) throw studentError(502, "Q10_CATALOG_INVALID", "Q10 devolvió un catálogo inválido.")
    const programs = new Map<string, string>()
    for (const { Codigo, Nombre, Numero_resolucion } of parsed.data) {
        if (Numero_resolucion === null && !/2026|kids|juniors/i.test(Nombre)) programs.set(Codigo, Nombre)
    }
    return Array.from(programs, ([code, name]) => ({ code, name }))
}

export async function uploadStudentDocument(file: File) {
    const form = new FormData()
    form.set("file", file)
    form.set("nombre", `documento-${randomUUID()}`)
    const { data } = await requestCiunac("upload/DNIS", { method: "POST", body: form })
    const parsed = z.object({ success: z.literal(true), viewLink: documentUrl }).safeParse(data)
    if (!parsed.success) throw studentError(502, "INVALID_UPLOAD", "Drive no devolvió un enlace válido para el documento.")
    return { viewLink: parsed.data.viewLink }
}

export async function registerStudent(payload: Q10Payload) {
    const operationId = randomUUID()
    const response = await requestCiunac("q10/estudiantes", { method: "POST", body: payload, operationId })
    const parsed = registrationSuccessSchema.safeParse(response.data)
    const headerId = z.uuid().safeParse(response.operationId)
    const reference = headerId.success ? headerId.data : operationId
    if (response.status !== 201 || !parsed.success) {
        throw new StudentRequestError(502, {
            code: "Q10_RESULT_UNCERTAIN",
            message: "CIUNAC respondió sin confirmar el alta. Consulte con soporte.",
            operationId: reference,
            retryAllowed: false,
        })
    }
    return { ...parsed.data, operationId: reference }
}
