import { z } from "zod"

export const studentType = z.enum(["PRE", "POS", "PG"])
export const studentTypeFilter = z.enum(["PRE", "POS", "PG", "SIN_CLASIFICAR"])
export const documentType = z.enum(["DNI", "CE", "PASAPORTE"])
export const studentId = z.uuid()
export const documentNumber = z.string().trim().min(1, "Ingrese el documento").regex(
    /^[^/\\?#%\u0000-\u001F]+$/,
    "Ingrese un documento válido",
).refine((value) => value !== "." && value !== "..", "Ingrese un documento válido")
export const birthDate = z.iso.date({ error: "Ingrese una fecha válida" })
export const q10IdType = { DNI: "PE01", CE: "PE02", PASAPORTE: "PE03" } as const

const id = z.number().int().positive().max(2147483647)
const catalogItem = z.object({ id, nombre: z.string() })
export const facultySchema = catalogItem
export const schoolSchema = catalogItem.extend({
    facultadId: id,
    tipo: z.enum(["PRE", "POS"]).nullish(),
})
export type Faculty = z.infer<typeof facultySchema>
export type School = z.infer<typeof schoolSchema>
export type Program = { code: string; name: string }

export const studentRowSchema = z.object({
    id: studentId,
    nombres: z.string(),
    apellidos: z.string(),
    tipoDocumento: z.string(),
    numeroDocumento: z.string(),
    codigo: z.string().nullish(),
    tipoEstudiante: studentType.nullish(),
    idQ10: z.string().nullish(),
    facultadId: id.nullish(),
    escuelaId: id.nullish(),
    facultad: catalogItem.nullish(),
    escuela: catalogItem.nullish(),
})

export const studentDetailSchema = studentRowSchema.extend({
    genero: z.string().nullish(),
    fechaNacimiento: z.string().nullish(),
    celular: z.string().nullish(),
    email: z.string().nullish(),
    direccion: z.string().nullish(),
    imgDoc: z.string().nullish(),
    creadoEn: z.iso.datetime({ offset: true }).nullish(),
    modificadoEn: z.iso.datetime({ offset: true }).nullish(),
})

export const studentPageSchema = z.object({
    data: z.array(studentRowSchema),
    meta: z.object({
        page: z.number().int().positive(),
        limit: z.number().int().positive().max(100),
        total: z.number().int().nonnegative(),
        totalPages: z.number().int().nonnegative(),
    }),
})
export type StudentPage = z.infer<typeof studentPageSchema>
export type StudentDetail = z.infer<typeof studentDetailSchema>

const positiveQueryInteger = z.string().regex(/^\d+$/).transform(Number)
export const studentQuerySchema = z.object({
    page: positiveQueryInteger.pipe(z.number().int().positive()).optional(),
    limit: positiveQueryInteger.pipe(z.number().int().positive().max(100)).optional(),
    search: z.string().trim().optional(),
    tipoEstudiante: studentTypeFilter.optional(),
    facultadId: positiveQueryInteger.pipe(id).optional(),
    escuelaId: positiveQueryInteger.pipe(id).optional(),
    vinculadoQ10: z.enum(["true", "false"]).optional(),
}).strict()

export function readStudentQuery(params: URLSearchParams) {
    const entries = [...params]
    if (new Set(params.keys()).size !== entries.length) return undefined
    const result = studentQuerySchema.safeParse(Object.fromEntries(entries))
    return result.success ? result.data : undefined
}

export function studentHref(path: string, query: string) {
    return query ? `${path}?${query}` : path
}

export const documentUrl = z.url({ protocol: /^https?$/ })
export const allowedDocumentTypes = ["application/pdf", "image/jpeg", "image/png"]
export const documentMaximumBytes = 10 * 1024 * 1024

const required = z.string().trim().min(1, "Campo obligatorio")
export const requiredStudentName = required.toUpperCase()
const code = z.string().trim().min(1).max(50)
const email = z.string().trim().pipe(z.email({ error: "Ingrese un correo válido" }))
const gender = z.enum(["M", "F"], { error: "Seleccione el género" })

export const q10PayloadSchema = z.strictObject({
    Primer_nombre: requiredStudentName,
    Segundo_nombre: requiredStudentName.optional(),
    Primer_apellido: requiredStudentName,
    Segundo_apellido: requiredStudentName,
    Email: email,
    Codigo_tipo_identificacion: z.enum(["PE01", "PE02", "PE03"]),
    Numero_identificacion: documentNumber,
    Genero: gender,
    Fecha_nacimiento: birthDate,
    Telefono: required,
    Celular: required,
    Direccion: required.optional(),
    Codigo_programa: required,
    tipoEstudiante: studentType.optional(),
    codigo: code.optional(),
    facultadId: id.optional(),
    escuelaId: id.optional(),
    imgDoc: documentUrl.optional(),
})
export const registrationRequestSchema = z.strictObject({
    payload: q10PayloadSchema,
    verifiedUnlinked: z.boolean(),
})
export type Q10Payload = z.infer<typeof q10PayloadSchema>

export const studentPatchSchema = z.strictObject({
    nombres: requiredStudentName,
    apellidos: requiredStudentName,
    genero: gender,
    fechaNacimiento: birthDate,
    tipoDocumento: documentType,
    numeroDocumento: documentNumber,
    celular: required,
    email: z.union([z.literal(""), email]),
    direccion: z.string().trim(),
    tipoEstudiante: studentType,
    codigo: z.union([z.literal(""), code]),
    facultadId: id.nullable(),
    escuelaId: id.nullable(),
    imgDoc: documentUrl,
}).partial()
export type StudentPatch = z.infer<typeof studentPatchSchema>

export const registrationSuccessSchema = z.object({
    status: z.literal("COMPLETED"),
    estudiante: z.object({ id: studentId, idQ10: required }),
    programaRegistrado: z.literal(true),
})
export type RegistrationSuccess = z.infer<typeof registrationSuccessSchema> & { operationId: string }

export const apiFailureSchema = z.object({
    code: z.string(),
    message: z.string(),
    operationId: studentId.optional(),
    estudianteId: studentId.optional(),
    idQ10: z.string().optional(),
    stage: z.string().optional(),
    origin: z.enum(["request", "local", "q10"]).optional(),
    validationErrors: z.array(z.object({ field: z.string(), rules: z.array(z.string()) })).optional(),
    retryAllowed: z.literal(false).optional(),
})
export type StudentApiFailure = z.infer<typeof apiFailureSchema>
