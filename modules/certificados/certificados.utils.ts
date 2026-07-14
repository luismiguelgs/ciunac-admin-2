import type { ICertificado, ICertificadoNota } from "./certificado.interface"

export function getCertificadoId(certificado?: Pick<ICertificado, "id" | "_id"> | null): string {
    return certificado?.id || certificado?._id || ""
}

export function isCertificadoDigital(tipo?: string | null): boolean {
    const normalized = (tipo || "").trim().toUpperCase()
    return normalized === "VIRTUAL" || normalized === "DIGITAL"
}

export function getNumeroRegistroSuggestion(tipo: string, nivel?: string | null): string {
    const normalizedLevel = (nivel ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase()

    const isBasic = normalizedLevel.includes("BASICO")
    const isIntermediateOrAdvanced = normalizedLevel.includes("INTERMEDIO") || normalizedLevel.includes("AVANZADO")
    if (!isBasic && !isIntermediateOrAdvanced) return ""

    if (isCertificadoDigital(tipo)) return isBasic ? "D-B00" : "D-IA0"
    return isBasic ? "B00 - Folio " : "IA0 - Folio "
}

export function normalizeNumeroRegistro(value: string): string {
    return value.trim().replace(/\s+/g, " ").toLocaleUpperCase("es-PE")
}

export function getCurrentCertificatePeriod(date = new Date()): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
}

export function cleanCertificadoNotas(notas: ICertificadoNota[]): ICertificadoNota[] {
    return notas.map(({ id: _id, isNew: _isNew, ...nota }) => ({
        ...nota,
        nota: Number(nota.nota),
    }))
}

export function buildCertificadoFileName(certificado: ICertificado): string {
    const sanitize = (value: unknown) => String(value || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9-_ ]/g, "")
        .trim()
        .replace(/\s+/g, "_")

    const date = new Date(certificado.fechaEmision)
    const datePart = Number.isNaN(date.getTime())
        ? "sin-fecha"
        : `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`

    return [
        "Certificado",
        sanitize(certificado.estudiante) || "Alumno",
        sanitize(certificado.idioma) || "Idioma",
        sanitize(certificado.nivel) || "Nivel",
        sanitize(certificado.numeroRegistro) || getCertificadoId(certificado),
        datePart,
    ].filter(Boolean).join("_") + ".pdf"
}

export function capitalizeCertificateName(value: string): string {
    return value
        .toLocaleLowerCase("es-PE")
        .replace(/(^|\s|[-'])\p{L}/gu, letter => letter.toLocaleUpperCase("es-PE"))
}
