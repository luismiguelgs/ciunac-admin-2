import { z } from "zod"

export const DOCUMENT_TYPES = [
    { label: "DNI", value: "DNI" },
    { label: "Carnet de extranjeria", value: "CE" },
    { label: "Pasaporte", value: "PASAPORTE" },
] as const

export const nuevaSolicitudSchema = z.object({
    tipoDocumento: z.enum(["DNI", "CE", "PASAPORTE"]),
    numeroDocumento: z.string().trim().min(1, "El documento es requerido"),
    nombres: z.string().trim().min(2, "Los nombres son requeridos"),
    apellidos: z.string().trim().min(2, "Los apellidos son requeridos"),
    celular: z.string().trim().regex(/^\d{9}$/, "El celular debe tener 9 digitos"),
    facultadId: z.string(),
    escuelaId: z.string(),
    codigo: z.string().trim(),
    alumnoCiunac: z.boolean(),
    tipoSolicitudId: z.string().min(1, "El tipo de solicitud es requerido"),
    idiomaId: z.string().min(1, "El idioma es requerido"),
    nivelId: z.string().min(1, "El nivel es requerido"),
    numeroVoucher: z.string().trim().regex(/^\d{15}$/, "El voucher debe tener 15 digitos"),
    pago: z.string().trim().refine(value => value !== "" && Number.isFinite(Number(value)) && Number(value) >= 0, {
        message: "El monto debe ser mayor o igual a 0",
    }),
    fechaPago: z.date({ error: "La fecha de pago es requerida" }),
    observaciones: z.string().trim(),
}).superRefine((values, context) => {
    const documentRules = {
        DNI: /^\d{8}$/,
        CE: /^\d{9}$/,
        PASAPORTE: /^[A-Za-z0-9]{6,20}$/,
    }

    if (!documentRules[values.tipoDocumento].test(values.numeroDocumento)) {
        const messages = {
            DNI: "El DNI debe tener 8 digitos",
            CE: "El carnet de extranjeria debe tener 9 digitos",
            PASAPORTE: "El pasaporte debe ser alfanumerico y tener entre 6 y 20 caracteres",
        }
        context.addIssue({
            code: "custom",
            path: ["numeroDocumento"],
            message: messages[values.tipoDocumento],
        })
    }
})

export type NuevaSolicitudFormValues = z.infer<typeof nuevaSolicitudSchema>

export function getNuevaSolicitudDefaults(): NuevaSolicitudFormValues {
    return {
        tipoDocumento: "DNI",
        numeroDocumento: "",
        nombres: "",
        apellidos: "",
        celular: "",
        facultadId: "",
        escuelaId: "",
        codigo: "",
        alumnoCiunac: false,
        tipoSolicitudId: "",
        idiomaId: "",
        nivelId: "",
        numeroVoucher: "",
        pago: "0",
        fechaPago: new Date(),
        observaciones: "",
    }
}
