export interface IPagoBanco {
    id: number
    dniCodigo: string | null
    numeroVoucher: string | null
    alumno: string | null
    monto: string | number | null
    fechaPago: string | null
    fechaEfectiva: string | null
    periodo: string | null
    voucherRestante: string | null
    archivo: string | null
    verificado: boolean
    creadoEn: string
    modificadoEn: string
}

export interface IPagosBancoUploadResult {
    message: string
    resumen?: Record<string, number>
}
