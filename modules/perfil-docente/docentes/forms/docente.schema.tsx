import { z } from "zod"

export const schema = z.object({
    nombres: z.string().min(1, "Nombres es requerido").max(50, "Nombres debe tener maximo 50 caracteres"),
    apellidos: z.string().min(1, "Apellidos es requerido").max(50, "Apellidos debe tener maximo 50 caracteres"),
    fechaNacimiento: z.date().optional(),
    genero: z.enum(["M", "F"]),
    tipoDocumento: z.enum(["DNI", "CE", "PASAPORTE"]),
    numeroDocumento: z.string().min(1, "Numero de documento es requerido"),
    celular: z.string().min(1, "Celular es requerido"),
    activo: z.boolean()
})

export type DocenteSchema = z.infer<typeof schema>

export const defaultValues: DocenteSchema = {
    nombres: "",
    apellidos: "",
    fechaNacimiento: undefined,
    genero: "M",
    tipoDocumento: "DNI",
    numeroDocumento: "",
    celular: "",
    activo: true,
}