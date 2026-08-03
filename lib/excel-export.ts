export type ExcelCellValue = string | number | boolean | Date | null | undefined

export interface ExcelExportColumn<TData> {
    header: string
    width?: number
    value: (item: TData) => ExcelCellValue
    numberFormat?: string
}

export interface ExcelExportOptions<TData> {
    data: TData[]
    columns: ExcelExportColumn<TData>[]
    fileName: string
    sheetName?: string
}

function normalizeSheetName(value: string): string {
    return value.replace(/[\\/*?:\[\]]/g, " ").trim().slice(0, 31) || "Datos"
}

export async function exportToExcel<TData>({
    data,
    columns,
    fileName,
    sheetName = "Datos",
}: ExcelExportOptions<TData>): Promise<void> {
    if (!data.length) throw new Error("No hay registros para exportar")
    if (!columns.length) throw new Error("No hay columnas configuradas para exportar")

    const ExcelJS = await import("exceljs")
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet(normalizeSheetName(sheetName))

    workbook.creator = "CIUNAC Admin"
    workbook.created = new Date()

    worksheet.columns = columns.map(column => ({
        header: column.header,
        width: column.width ?? 18,
    }))
    worksheet.addRows(data.map(item => columns.map(column => column.value(item) ?? null)))

    const header = worksheet.getRow(1)
    header.height = 24
    header.font = { bold: true, color: { argb: "FFFFFFFF" } }
    header.alignment = { vertical: "middle", horizontal: "center" }
    header.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF111827" },
    }

    columns.forEach((column, index) => {
        if (column.numberFormat) worksheet.getColumn(index + 1).numFmt = column.numberFormat
    })

    worksheet.views = [{ state: "frozen", ySplit: 1 }]
    worksheet.autoFilter = {
        from: { row: 1, column: 1 },
        to: { row: 1, column: columns.length },
    }
    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) row.alignment = { vertical: "middle" }
    })

    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer as BlobPart], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")

    link.href = url
    link.download = fileName.toLowerCase().endsWith(".xlsx") ? fileName : `${fileName}.xlsx`
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
}
