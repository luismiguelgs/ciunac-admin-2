import type { Cumplimiento } from "./interfaces/detalle-resultado.interface"

export const RANKING_RUBRO_ID = {
    documentacionPagos: 1,
    examenSustitutorio: 2,
    actasNotas: 3,
    gestionAula: 4,
} as const

const ADMINISTRATIVE_RUBRO_IDS = [
    RANKING_RUBRO_ID.documentacionPagos,
    RANKING_RUBRO_ID.examenSustitutorio,
    RANKING_RUBRO_ID.actasNotas,
] as const

const ADMINISTRATIVE_RUBRO_ORDER = new Map<number, number>(
    ADMINISTRATIVE_RUBRO_IDS.map((rubroId, index) => [rubroId, index])
)

function toFiniteNumber(value: string | number): number | null {
    const number = Number(value)
    return Number.isFinite(number) ? number : null
}

export function getCumplimientosAdministrativos(items: Cumplimiento[] | null | undefined): Cumplimiento[] {
    return (items ?? [])
        .filter(item => ADMINISTRATIVE_RUBRO_ORDER.has(item.rubroId))
        .toSorted((a, b) => (
            (ADMINISTRATIVE_RUBRO_ORDER.get(a.rubroId) ?? Number.MAX_SAFE_INTEGER)
            - (ADMINISTRATIVE_RUBRO_ORDER.get(b.rubroId) ?? Number.MAX_SAFE_INTEGER)
        ))
}

export function getGestionAula(items: Cumplimiento[] | null | undefined): Cumplimiento | undefined {
    return (items ?? []).find(item => item.rubroId === RANKING_RUBRO_ID.gestionAula)
}

export function getPorcentajePonderado(items: Cumplimiento[] | null | undefined): number {
    let totalWeight = 0
    let weightedScore = 0

    for (const item of items ?? []) {
        const weight = toFiniteNumber(item.peso)
        if (weight === null || weight <= 0) continue

        const backendWeightedScore = toFiniteNumber(item.puntajePonderado)
        const score = toFiniteNumber(item.puntaje)
        totalWeight += weight
        weightedScore += backendWeightedScore ?? (score ?? 0) * weight
    }

    if (totalWeight === 0) return 0
    return Math.min(100, Math.max(0, weightedScore / totalWeight))
}

export function normalizeRankingPercentage(value: string | number | null | undefined): number {
    if (value === null || value === undefined) return 0
    const number = toFiniteNumber(value)
    return number === null ? 0 : Math.min(100, Math.max(0, number))
}
