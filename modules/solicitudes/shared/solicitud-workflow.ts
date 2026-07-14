import type { IEstado, ITipoSolicitud } from "@/modules/estructura/interfaces/types.interface"
import type { ISolicitud } from "./solicitud.interface"

export type SolicitudTipoGroup = "certificados" | "constancias" | "ubicacion"
export type SolicitudEstadoKey =
    | "nueva"
    | "pagada"
    | "asignada"
    | "finalizada"
    | "observada"
    | "rechazada"

export type SolicitudWorkflowData = {
    nuevas: ISolicitud[]
    pagadas: ISolicitud[]
    asignadas: ISolicitud[]
    finalizadas: ISolicitud[]
    observadas: ISolicitud[]
    rechazadas: ISolicitud[]
}

export type SolicitudWorkflowStateIds = Record<Exclude<SolicitudEstadoKey, "observada">, number> & {
    observada?: number
}

const STATE_MATCHERS: Record<SolicitudEstadoKey, string[]> = {
    nueva: ["NUEVA", "NUEVO", "PENDIENTE"],
    pagada: ["PAGADA", "PAGADO"],
    asignada: ["ASIGNADA", "ASIGNADO"],
    finalizada: ["FINALIZADA", "FINALIZADO", "FIRMADA", "FIRMADO", "TERMINADA", "TERMINADO", "COMPLETADA", "COMPLETADO"],
    observada: ["OBSERV", "PROCES"],
    rechazada: ["RECHAZADA", "RECHAZADO"],
}

const DOCUMENT_REQUEST_STATE_IDS: Record<SolicitudEstadoKey, number> = {
    nueva: 1,
    asignada: 2,
    finalizada: 3,
    pagada: 4,
    rechazada: 5,
    observada: 12,
}

export function normalizeCatalogText(value?: string | null): string {
    return (value ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, " ")
        .trim()
}

export function isTipoSolicitudInGroup(
    tipo: Pick<ITipoSolicitud, "solicitud"> | undefined,
    group: SolicitudTipoGroup
): boolean {
    const name = normalizeCatalogText(tipo?.solicitud)

    if (group === "certificados") return name.includes("CERTIFIC")
    if (group === "constancias") return name.includes("CONSTANCIA")
    return name.includes("EXAMEN") && name.includes("UBIC")
}

export function isAdministrativeSolicitudType(tipo: Pick<ITipoSolicitud, "solicitud"> | undefined): boolean {
    if (isTipoSolicitudInGroup(tipo, "certificados")) {
        return !normalizeCatalogText(tipo?.solicitud).includes("DIGITAL")
    }

    return isTipoSolicitudInGroup(tipo, "constancias") || isTipoSolicitudInGroup(tipo, "ubicacion")
}

export function filterTiposSolicitudByGroup(
    tiposSolicitud: ITipoSolicitud[],
    group: SolicitudTipoGroup
): ITipoSolicitud[] {
    return tiposSolicitud.filter(tipo => typeof tipo.id === "number" && isTipoSolicitudInGroup(tipo, group))
}

export function isTipoSolicitudDigital(tipo: Pick<ITipoSolicitud, "solicitud"> | undefined): boolean {
    const name = normalizeCatalogText(tipo?.solicitud)
    return name.includes("DIGITAL") || name.includes("CONSTANCIA")
}

export function findSolicitudEstado(
    estados: IEstado[],
    key: SolicitudEstadoKey,
    group?: SolicitudTipoGroup
): IEstado | undefined {
    const estadosSolicitud = estados.filter((estado) =>
        typeof estado.id === "number" && normalizeCatalogText(estado.referencia) === "SOLICITUD"
    )
    const documentRequest = group === "constancias" || group === "certificados"
    const expectedId = documentRequest ? DOCUMENT_REQUEST_STATE_IDS[key] : undefined

    if (typeof expectedId === "number") {
        const estadoById = estadosSolicitud.find((estado) => estado.id === expectedId)
        if (estadoById) return estadoById
    }

    const aliases = STATE_MATCHERS[key]

    return estadosSolicitud.find((estado) => {
        const name = normalizeCatalogText(estado.nombre)
        return aliases.some(alias => name.includes(alias))
    })
}

export function resolveSolicitudWorkflowEstados(
    estados: IEstado[],
    group?: SolicitudTipoGroup
): SolicitudWorkflowStateIds {
    const requiredKeys: Array<Exclude<SolicitudEstadoKey, "observada">> = ["nueva", "pagada", "asignada", "finalizada", "rechazada"]
    const resolved = {} as SolicitudWorkflowStateIds
    const missing: string[] = []

    for (const key of requiredKeys) {
        const estado = findSolicitudEstado(estados, key, group)
        if (typeof estado?.id !== "number") {
            missing.push(key)
        } else {
            resolved[key] = estado.id
        }
    }

    if (missing.length) {
        throw new Error(`No se encontraron los estados de solicitud: ${missing.join(", ")}`)
    }

    const observada = findSolicitudEstado(estados, "observada", group)
    if (typeof observada?.id === "number") resolved.observada = observada.id

    return resolved
}
