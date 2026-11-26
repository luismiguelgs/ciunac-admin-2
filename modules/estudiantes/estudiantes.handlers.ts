import "server-only"

import type { NextRequest } from "next/server"
import { z } from "zod"
import { auth } from "@/auth"
import { ESTUDIANTES_PERMISSION } from "@/lib/access-control"
import { canAccessRoute } from "@/lib/permissions"
import {
    allowedDocumentTypes, documentMaximumBytes, documentNumber, readStudentQuery,
    registrationRequestSchema, studentId, studentPatchSchema,
} from "./estudiantes.contract"
import {
    findStudentDocument, getStudent, getStudentPrograms, listStudents, registerStudent, studentError,
    StudentRequestError, updateStudent, uploadStudentDocument,
} from "./estudiantes.server"

export function studentHandler<Args extends unknown[]>(handler: (request: NextRequest, ...args: Args) => Promise<Response>) {
    return async (request: NextRequest, ...args: Args) => {
        try {
            const session = await auth()
            if (!session?.user) throw studentError(401, "SESSION_REQUIRED", "Inicie sesión para continuar.")
            if (!canAccessRoute({ role: session.user.rol, permissions: session.user.permisos, requiredPermission: ESTUDIANTES_PERMISSION })) {
                throw studentError(403, "FORBIDDEN", "No tiene permiso para gestionar estudiantes.")
            }
            if (request.method !== "GET") {
                const origin = process.env.APP_BASE_URL ? new URL(process.env.APP_BASE_URL).origin : request.nextUrl.origin
                if (request.headers.get("Origin") !== origin) {
                    throw studentError(403, "INVALID_ORIGIN", "Origen de solicitud no permitido.")
                }
            }
            return await handler(request, ...args)
        } catch (error) {
            if (error instanceof StudentRequestError) return json(error.failure, error.status)
            return json({ code: "UNEXPECTED_RESPONSE", message: "No se pudo completar la consulta." }, 502)
        }
    }
}

function json(data: unknown, status = 200) {
    return Response.json(data, { status, headers: { "Cache-Control": "private, no-store" } })
}

async function readJson(request: Request) {
    if (!request.headers.get("Content-Type")?.startsWith("application/json")) {
        throw studentError(415, "INVALID_CONTENT_TYPE", "La solicitud debe enviarse en JSON.")
    }
    const raw = await request.text()
    if (new TextEncoder().encode(raw).byteLength > 100 * 1024) {
        throw studentError(413, "REQUEST_TOO_LARGE", "La solicitud supera el tamaño permitido.")
    }
    try {
        return JSON.parse(raw) as unknown
    } catch {
        throw studentError(400, "INVALID_JSON", "No se pudo interpretar la solicitud.")
    }
}

async function parseBody<T>(request: Request, schema: z.ZodType<T>): Promise<T> {
    const result = schema.safeParse(await readJson(request))
    if (!result.success) {
        throw new StudentRequestError(400, {
            code: "INVALID_FIELDS",
            message: "Revise los campos enviados.",
            validationErrors: result.error.issues.map((issue) => ({
                field: String(issue.path.at(-1) ?? "unknown"),
                rules: [issue.code],
            })),
        })
    }
    return result.data
}

type StudentRouteContext = { params: Promise<{ id: string }> }

async function routeId(context: StudentRouteContext) {
    const result = studentId.safeParse((await context.params).id)
    if (!result.success) throw studentError(400, "INVALID_ID", "El identificador local no es válido.")
    return result.data
}

export const list = studentHandler(async (request) => {
    const query = readStudentQuery(request.nextUrl.searchParams)
    if (!query) throw studentError(400, "INVALID_QUERY", "Revise la página, el límite y los filtros de estudiantes.")
    return json(await listStudents(query))
})

export const detail = studentHandler(async (_request, context: StudentRouteContext) => {
    return json(await getStudent(await routeId(context)))
})

export const lookup = studentHandler(async (request) => {
    const { documento } = await parseBody(request, z.strictObject({ documento: documentNumber }))
    const student = await findStudentDocument(documento)
    return json(student ? { id: student.id, idQ10: student.idQ10 ?? null } : null)
})

export const patch = studentHandler(async (request, context: StudentRouteContext) => {
    const id = await routeId(context)
    const changes = await parseBody(request, studentPatchSchema)
    if (!Object.keys(changes).length) throw studentError(400, "NO_CHANGES", "No hay cambios para guardar.")
    if (changes.tipoDocumento !== undefined || changes.numeroDocumento !== undefined) {
        const current = await getStudent(id)
        if (!current) throw studentError(404, "STUDENT_MISSING", "El estudiante ya no está disponible.")
        if (current.idQ10?.trim()) throw studentError(409, "IDENTITY_LOCKED", "El documento está protegido porque el estudiante tiene vínculo con Q10.")
    }
    const updated = await updateStudent(id, changes)
    if (!updated) throw studentError(404, "STUDENT_MISSING", "No se encontró el estudiante para guardar los cambios.")
    return json(updated)
})

export const programs = studentHandler(async () => json(await getStudentPrograms()))

export const upload = studentHandler(async (request) => {
    const length = Number(request.headers.get("Content-Length"))
    if (length > documentMaximumBytes + 64 * 1024) {
        throw studentError(413, "DOCUMENT_TOO_LARGE", "El documento debe pesar como máximo 10 MB.")
    }
    const form = await request.formData().catch(() => null)
    const file = form?.get("file")
    if (!(file instanceof File) || !file.size || !allowedDocumentTypes.includes(file.type)) {
        throw studentError(400, "INVALID_DOCUMENT", "Seleccione un documento PDF, JPG o PNG.")
    }
    if (file.size > documentMaximumBytes) throw studentError(413, "DOCUMENT_TOO_LARGE", "El documento debe pesar como máximo 10 MB.")
    return json(await uploadStudentDocument(file), 201)
})

export const register = studentHandler(async (request) => {
    const { payload, verifiedUnlinked } = await parseBody(request, registrationRequestSchema)
    const [availablePrograms, existing] = await Promise.all([
        getStudentPrograms(),
        findStudentDocument(payload.Numero_identificacion),
    ])
    if (existing && (existing.idQ10?.trim() || !verifiedUnlinked)) {
        const linked = Boolean(existing.idQ10?.trim())
        throw new StudentRequestError(409, {
            code: linked ? "STUDENT_ALREADY_LINKED" : "STUDENT_REVIEW_REQUIRED",
            message: linked ? "El estudiante ya tiene un vínculo local con Q10." : "Revise el registro local y confirme la verificación en Q10.",
            estudianteId: existing.id,
        })
    }
    if (!availablePrograms.some(({ code }) => code === payload.Codigo_programa)) {
        throw studentError(400, "PROGRAM_UNAVAILABLE", "El programa ya no está disponible. Actualice el catálogo.")
    }
    return json(await registerStudent(payload), 201)
})
