import z from "zod"

export const schema = z.object({
    moduloId: z.string().min(1, "Modulo es requerido"),
    cicloId: z.string().min(1, "Ciclo es requerido"),
    codigo: z.string().min(1, "Codigo es requerido"),
    docenteId: z.string().min(1, "Docente es requerido"),
    frecuencia: z.string().min(1, "Frecuencia es requerido"),
    modalidad: z.string().min(1, "Modalidad es requerido"),
    aulaId: z.string().optional().nullable(),
})

export type GrupoSchema = z.infer<typeof schema>

export const defaultValues: GrupoSchema = {
    moduloId: "",
    cicloId: "",
    codigo: "",
    docenteId: "",
    frecuencia: "",
    modalidad: "",
    aulaId: null,
}