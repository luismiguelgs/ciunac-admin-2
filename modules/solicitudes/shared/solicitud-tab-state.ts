export const SOLICITUD_STATE_QUERY_PARAM = "estado"

export const SOLICITUD_WORKFLOW_TAB_VALUES = [
    "nuevas",
    "pagadas",
    "asignadas",
    "finalizadas",
    "observadas",
    "rechazadas",
] as const

export const SOLICITUD_BECA_TAB_VALUES = [
    "nuevas",
    "aprobados",
    "rechazados",
] as const

export type SolicitudWorkflowTabState = typeof SOLICITUD_WORKFLOW_TAB_VALUES[number]
export type SolicitudBecaTabState = typeof SOLICITUD_BECA_TAB_VALUES[number]

export function resolveTabState<T extends string>(
    value: string | string[] | undefined,
    allowedValues: readonly T[],
    fallback: T,
): T {
    const candidate = Array.isArray(value) ? value[0] : value
    return candidate && allowedValues.includes(candidate as T)
        ? candidate as T
        : fallback
}

export function buildSolicitudStateHref(pathname: string, state: string): string {
    const params = new URLSearchParams()
    params.set(SOLICITUD_STATE_QUERY_PARAM, state)
    return `${pathname}?${params.toString()}`
}
