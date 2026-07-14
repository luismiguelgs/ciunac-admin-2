export interface ICertificadoReporteItem {
    numeroRegistro: string
    tipo: "VIRTUAL" | "DIGITAL" | "FISICO"
    alumno: string
    idioma: string
    nivel: string
    periodo: string
    numeroVoucher: string
}

export interface ICertificadoReporteGrupo {
    digitales: ICertificadoReporteItem[]
    fisicos: ICertificadoReporteItem[]
}

export interface ICertificadoReporteResponse {
    basico: ICertificadoReporteGrupo
    intermedioAvanzado: ICertificadoReporteGrupo
}
