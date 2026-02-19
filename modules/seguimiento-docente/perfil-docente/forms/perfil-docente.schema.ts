import z from "zod";

export const perfilDocenteSchema = z.object({
    docenteId: z.string().min(1, "Debe seleccionar un docente"),
    experienciaTotal: z.string().min(1, "La experiencia total es requerida"),
    idiomaId: z.string().min(1, "Debe seleccionar un idioma"),
    nivelIdioma: z.string().nullable(),
    puntajeFinal: z.string().min(1, "El puntaje final es requerido"),
})

export type PerfilDocenteSchema = z.infer<typeof perfilDocenteSchema>

export const perfilDocenteDefaultValues: PerfilDocenteSchema = {
    docenteId: "",
    experienciaTotal: "0",
    idiomaId: "",
    nivelIdioma: null,
    puntajeFinal: "0",
}
