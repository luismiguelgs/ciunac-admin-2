import { z } from "zod"
import {
    birthDate, documentNumber, documentType, q10IdType, requiredStudentName, studentType,
    type Q10Payload, type School, type StudentDetail, type StudentPatch,
} from "./estudiantes.contract"

const required = z.string().trim().min(1, "Campo obligatorio")
const email = z.email({ error: "Ingrese un correo válido" })
const catalogValue = z.string().regex(/^(none|[1-9]\d*)$/)
const academic = z.object({
    tipoEstudiante: z.union([studentType, z.literal("none")]),
    facultadId: catalogValue,
    escuelaId: catalogValue,
    codigo: z.string().trim().max(50, "Use hasta 50 caracteres"),
})
export type AcademicValues = z.infer<typeof academic>

export const commonDefaults = {
    tipoEstudiante: "none",
    facultadId: "none",
    escuelaId: "none",
    codigo: "",
    celular: "",
    direccion: "",
    email: "",
} as const

const common = academic.extend({
    celular: required,
    direccion: z.string().trim(),
})

export const newStudentSchema = common.extend({
    primerNombre: requiredStudentName,
    segundoNombre: z.string().trim().toUpperCase(),
    primerApellido: requiredStudentName,
    segundoApellido: requiredStudentName,
    email: z.string().trim().pipe(email),
    tipoDocumento: documentType,
    numeroDocumento: documentNumber,
    genero: z.enum(["M", "F"], { error: "Seleccione el género" }),
    fechaNacimiento: birthDate,
    telefono: required,
    programa: required,
})
export type NewStudentValues = z.infer<typeof newStudentSchema>

export const editStudentSchema = common.extend({
    nombres: required,
    apellidos: required,
    tipoDocumento: required,
    numeroDocumento: documentNumber,
    genero: z.string(),
    fechaNacimiento: z.union([z.literal(""), birthDate]),
    email: z.string().trim().pipe(z.union([z.literal(""), email])),
})
export type EditStudentValues = z.infer<typeof editStudentSchema>

export function schoolMatches(school: School, facultyId: string, studentKind: string) {
    const facultyMatches = !Number(facultyId) || Number(facultyId) === school.facultadId
    const typeMatches = (studentKind !== "PRE" && studentKind !== "POS") || studentKind === school.tipo
    return facultyMatches && typeMatches
}

export function toQ10Payload(values: NewStudentValues, imgDoc?: string): Q10Payload {
    return {
        Primer_nombre: values.primerNombre,
        Segundo_nombre: values.segundoNombre || undefined,
        Primer_apellido: values.primerApellido,
        Segundo_apellido: values.segundoApellido,
        Email: values.email,
        Codigo_tipo_identificacion: q10IdType[values.tipoDocumento],
        Numero_identificacion: values.numeroDocumento,
        Genero: values.genero,
        Fecha_nacimiento: values.fechaNacimiento,
        Telefono: values.telefono,
        Celular: values.celular,
        Direccion: values.direccion || undefined,
        Codigo_programa: values.programa,
        tipoEstudiante: values.tipoEstudiante === "none" ? undefined : values.tipoEstudiante,
        codigo: values.codigo.trim() || undefined,
        facultadId: Number(values.facultadId) || undefined,
        escuelaId: Number(values.escuelaId) || undefined,
        imgDoc,
    }
}

export function getEditDefaults(student: StudentDetail): EditStudentValues {
    return {
        nombres: student.nombres,
        apellidos: student.apellidos,
        tipoDocumento: student.tipoDocumento,
        numeroDocumento: student.numeroDocumento,
        genero: student.genero ?? "",
        fechaNacimiento: student.fechaNacimiento?.slice(0, 10) ?? "",
        celular: student.celular ?? "",
        email: student.email ?? "",
        direccion: student.direccion ?? "",
        tipoEstudiante: student.tipoEstudiante ?? "none",
        codigo: student.codigo ?? "",
        facultadId: student.facultadId ? String(student.facultadId) : "none",
        escuelaId: student.escuelaId ? String(student.escuelaId) : "none",
    }
}

export function buildStudentPatch(values: EditStudentValues, defaults: EditStudentValues, identityLocked: boolean, imgDoc?: string) {
    const patch: StudentPatch = {}
    for (const field of ["nombres", "apellidos", "celular", "email", "direccion", "codigo"] as const) {
        if (values[field] !== defaults[field].trim()) patch[field] = values[field]
    }
    if (values.genero !== defaults.genero && (values.genero === "M" || values.genero === "F")) patch.genero = values.genero
    if (values.fechaNacimiento && values.fechaNacimiento !== defaults.fechaNacimiento) patch.fechaNacimiento = values.fechaNacimiento
    if (!identityLocked) {
        const document = documentType.safeParse(values.tipoDocumento)
        if (document.success && document.data !== defaults.tipoDocumento) patch.tipoDocumento = document.data
        if (values.numeroDocumento !== defaults.numeroDocumento.trim()) patch.numeroDocumento = values.numeroDocumento
    }
    if (values.tipoEstudiante !== "none" && values.tipoEstudiante !== defaults.tipoEstudiante) patch.tipoEstudiante = values.tipoEstudiante
    for (const field of ["facultadId", "escuelaId"] as const) {
        if (values[field] !== defaults[field]) patch[field] = Number(values[field]) || null
    }
    if (imgDoc) patch.imgDoc = imgDoc
    return patch
}

export const studentTypeOptions = [
    { value: "PRE", label: "Pregrado" },
    { value: "POS", label: "Posgrado" },
    { value: "PG", label: "PG" },
]
export const studentDocumentOptions = [
    { value: "DNI", label: "DNI" },
    { value: "CE", label: "Carné de extranjería" },
    { value: "PASAPORTE", label: "Pasaporte" },
]
export const studentGenderOptions = [
    { value: "F", label: "Femenino" },
    { value: "M", label: "Masculino" },
]
