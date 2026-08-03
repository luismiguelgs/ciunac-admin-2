import type { ReportDateRange, ReportSolicitud } from "./reportes.interface"

const BUSINESS_TIME_ZONE = "America/Lima"
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

function getDatePartsInBusinessTimeZone(date: Date) {
    const formatter = new Intl.DateTimeFormat("en-CA", {
        timeZone: BUSINESS_TIME_ZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    })
    const parts = Object.fromEntries(
        formatter.formatToParts(date).map(part => [part.type, part.value])
    )

    return {
        year: parts.year,
        month: parts.month,
        day: parts.day,
    }
}

export function getDefaultReportDateRange(now = new Date()): ReportDateRange {
    const { year, month, day } = getDatePartsInBusinessTimeZone(now)
    return {
        inicio: `${year}-${month}-01`,
        fin: `${year}-${month}-${day}`,
    }
}

export function isValidIsoDate(value: string): boolean {
    if (!ISO_DATE_PATTERN.test(value)) return false

    const [year, month, day] = value.split("-").map(Number)
    const date = new Date(Date.UTC(year, month - 1, day))

    return date.getUTCFullYear() === year
        && date.getUTCMonth() === month - 1
        && date.getUTCDate() === day
}

export function validateReportDateRange(range: ReportDateRange): string | null {
    if (!range.inicio || !range.fin) return "Seleccione la fecha inicial y la fecha final."
    if (!isValidIsoDate(range.inicio) || !isValidIsoDate(range.fin)) {
        return "Ingrese un rango de fechas válido."
    }
    if (range.inicio > range.fin) {
        return "La fecha inicial no puede ser posterior a la fecha final."
    }
    return null
}

export function filterReportSolicitudes(
    solicitudes: ReportSolicitud[],
    allowedTypeIds: readonly number[],
): ReportSolicitud[] {
    const allowedIds = new Set(allowedTypeIds)
    return solicitudes.filter(solicitud => allowedIds.has(Number(solicitud.tipoSolicitudId)))
}

export function formatReportDate(value: string | Date | null | undefined): string {
    if (!value) return "-"
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return "-"

    return date.toLocaleDateString("es-PE", {
        timeZone: BUSINESS_TIME_ZONE,
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    })
}

export function getReportObservation(value: string | null | undefined): string {
    if (!value || !value.trim()) return ""
    return value
}

export function getReportSearchValue(solicitud: ReportSolicitud): string {
    return [
        solicitud.estudiante?.apellidos,
        solicitud.estudiante?.nombres,
        solicitud.estudiante?.numeroDocumento,
        solicitud.tiposSolicitud?.solicitud,
        solicitud.idioma?.nombre,
        solicitud.nivel?.nombre,
        solicitud.numeroVoucher,
        solicitud.estado?.nombre,
        getReportObservation(solicitud.observaciones),
    ].filter(Boolean).join(" ")
}
