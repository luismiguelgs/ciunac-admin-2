export const CERTIFICADOS_PAGE_QUERY_PARAM = "pagina"
export const CERTIFICADOS_PAGE_SIZE = 25

export function resolveCertificadosPage(value: string | string[] | undefined): number {
    const candidate = Array.isArray(value) ? value[0] : value
    const page = Number(candidate)
    return Number.isInteger(page) && page > 0 ? page : 1
}

export function validateCertificadosPage(page: number, totalRows: number): number {
    const lastPage = Math.max(1, Math.ceil(totalRows / CERTIFICADOS_PAGE_SIZE))
    return page <= lastPage ? page : 1
}

export function buildCertificadosListHref(signed: boolean, page: number): string {
    const pathname = signed ? "/certificados/firmados" : "/certificados"
    return page > 1 ? `${pathname}?${CERTIFICADOS_PAGE_QUERY_PARAM}=${page}` : pathname
}

export function buildCertificadoDetailHref(id: string, page: number): string {
    const pathname = `/certificados/${id}`
    return page > 1 ? `${pathname}?${CERTIFICADOS_PAGE_QUERY_PARAM}=${page}` : pathname
}
