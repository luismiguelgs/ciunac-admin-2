import z from "zod";

export const documentoSchema = z.object({
    tipoDocumentoPerfilId: z.string().min(1, "El tipo de documento es requerido"),
    estadoId: z.string().min(1, "El estado es requerido"),
    descripcion: z.string().min(1, "La descripción es requerida"),
    institucionEmisora: z.string().optional().nullable(),
    urlArchivo: z.string().optional().nullable(),
    fechaEmision: z.date(),
    horasCapacitacion: z.string().optional().nullable(),
    puntaje: z.string().optional().nullable(),
    experienciaLaboral: z.string().optional().nullable(),
});

export type DocumentoSchema = z.infer<typeof documentoSchema>;

export const documentoDefaultValues: DocumentoSchema = {
    tipoDocumentoPerfilId: "",
    estadoId: "",
    descripcion: "",
    institucionEmisora: "",
    urlArchivo: "",
    fechaEmision: new Date(),
    horasCapacitacion: "0",
    puntaje: "0",
    experienciaLaboral: "0",
};
