import type { ReportConfig, ReportDateRange, ReportSolicitud } from "./reportes.interface"
import { getReportObservation } from "./reportes.utils"

function toExcelDate(value: string | Date | null | undefined, dateOnly = false): Date | null {
    if (!value) return null

    if (dateOnly && typeof value === "string") {
        const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value)
        if (match) {
            const [, year, month, day] = match
            return new Date(Number(year), Number(month) - 1, Number(day))
        }
    }

    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? null : date
}

export async function exportReportToExcel(
    solicitudes: ReportSolicitud[],
    config: ReportConfig,
    range: ReportDateRange,
): Promise<void> {
    const ExcelJS = await import("exceljs")
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet(config.kind === "documentos" ? "Documentos" : "Examen de ubicacion")

    workbook.creator = "CIUNAC Admin"
    workbook.created = new Date()

    worksheet.columns = [
        { header: "Origen", key: "origen", width: 12 },
        { header: "Tipo de solicitud", key: "tipoSolicitud", width: 30 },
        { header: "Apellidos", key: "apellidos", width: 26 },
        { header: "Nombres", key: "nombres", width: 24 },
        { header: "Documento", key: "documento", width: 16 },
        { header: "Idioma", key: "idioma", width: 16 },
        { header: "Nivel", key: "nivel", width: 18 },
        { header: "Pago (S/)", key: "pago", width: 14 },
        { header: "Fecha de pago", key: "fechaPago", width: 17 },
        { header: "Número de recibo", key: "numeroVoucher", width: 20 },
        { header: "Estado", key: "estado", width: 18 },
        { header: "Observaciones", key: "observaciones", width: 42 },
        { header: "Fecha de solicitud", key: "fechaSolicitud", width: 20 },
    ]

    worksheet.addRows(solicitudes.map(solicitud => ({
        origen: solicitud.manual ? "MANUAL" : "ONLINE",
        tipoSolicitud: solicitud.tiposSolicitud?.solicitud ?? "",
        apellidos: solicitud.estudiante?.apellidos?.toUpperCase() ?? "",
        nombres: solicitud.estudiante?.nombres?.toUpperCase() ?? "",
        documento: solicitud.estudiante?.numeroDocumento ?? "",
        idioma: solicitud.idioma?.nombre ?? "",
        nivel: solicitud.nivel?.nombre ?? "",
        pago: Number(solicitud.pago) || 0,
        fechaPago: toExcelDate(solicitud.fechaPago, true),
        numeroVoucher: solicitud.numeroVoucher ?? "",
        estado: solicitud.estado?.nombre ?? "",
        observaciones: getReportObservation(solicitud.observaciones),
        fechaSolicitud: toExcelDate(solicitud.creadoEn),
    })))

    const header = worksheet.getRow(1)
    header.height = 24
    header.font = { bold: true, color: { argb: "FFFFFFFF" } }
    header.alignment = { vertical: "middle", horizontal: "center" }
    header.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF111827" },
    }

    worksheet.views = [{ state: "frozen", ySplit: 1 }]
    worksheet.autoFilter = { from: "A1", to: "M1" }
    worksheet.getColumn("H").numFmt = '"S/" #,##0.00'
    worksheet.getColumn("I").numFmt = "dd/mm/yyyy"
    worksheet.getColumn("M").numFmt = "dd/mm/yyyy hh:mm"
    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) row.alignment = { vertical: "middle" }
    })
    worksheet.getColumn("L").eachCell((cell, rowNumber) => {
        if (rowNumber > 1) cell.alignment = { vertical: "top", wrapText: true }
    })

    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer as BlobPart], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${config.exportPrefix}-${range.inicio}-a-${range.fin}.xlsx`
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
}
