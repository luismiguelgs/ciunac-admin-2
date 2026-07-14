import { z } from "zod"
import type { ICertificado } from "./certificado.interface"
import { getCurrentCertificatePeriod } from "./certificados.utils"

const required = "Campo requerido"

export const certificadoSchema = z.object({
    estudiante: z.string().trim().min(1, required),
    numeroDocumento: z.string().trim().min(1, required),
    solicitudId: z.coerce.number().positive("Asigne una solicitud pagada"),
    idiomaId: z.string().min(1, required),
    nivelId: z.string().min(1, required),
    cantidadHoras: z.coerce.number().min(100, "Minimo 100 horas").max(400, "Maximo 400 horas"),
    fechaEmision: z.date({ error: required }),
    fechaConcluido: z.date({ error: required }),
    numeroRegistro: z.string().trim().min(1, required),
    tipo: z.enum(["FISICO", "VIRTUAL"]),
    curriculaAnterior: z.boolean(),
    duplicado: z.boolean(),
    certificadoOriginal: z.string().trim(),
}).superRefine((values, context) => {
    if (values.duplicado && !values.certificadoOriginal) {
        context.addIssue({ code: "custom", path: ["certificadoOriginal"], message: required })
    }
})

export type CertificadoFormValues = z.infer<typeof certificadoSchema>

export function getCertificadoDefaults(certificado?: ICertificado): CertificadoFormValues {
    return {
        estudiante: certificado?.estudiante || "",
        numeroDocumento: certificado?.numeroDocumento || "",
        solicitudId: certificado?.solicitudId || 0,
        idiomaId: certificado?.idiomaId ? String(certificado.idiomaId) : "",
        nivelId: certificado?.nivelId ? String(certificado.nivelId) : "",
        cantidadHoras: certificado?.cantidadHoras || 0,
        fechaEmision: certificado?.fechaEmision ? new Date(certificado.fechaEmision) : new Date(),
        fechaConcluido: certificado?.fechaConcluido ? new Date(certificado.fechaConcluido) : new Date(),
        numeroRegistro: certificado?.numeroRegistro || "",
        tipo: certificado?.tipo === "FISICO" ? "FISICO" : "VIRTUAL",
        curriculaAnterior: Boolean(certificado?.curriculaAnterior),
        duplicado: Boolean(certificado?.duplicado),
        certificadoOriginal: certificado?.certificadoOriginal || "",
    }
}

export function getInitialCertificado(): ICertificado {
    return {
        tipo: "FISICO",
        periodo: getCurrentCertificatePeriod().replace("-", ""),
        estudiante: "",
        numeroDocumento: "",
        idioma: "",
        nivel: "",
        cantidadHoras: 0,
        solicitudId: 0,
        fechaEmision: new Date(),
        numeroRegistro: "",
        fechaConcluido: new Date(),
        impreso: false,
        aceptado: false,
        notas: [],
    }
}
