"use client"

import * as React from "react"
import { FileSpreadsheet, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
    exportToExcel,
    type ExcelExportColumn,
} from "@/lib/excel-export"

interface ExcelExportButtonProps<TData> {
    data: TData[]
    columns: ExcelExportColumn<TData>[]
    fileName: string
    sheetName?: string
    label?: string
    disabled?: boolean
}

export function ExcelExportButton<TData>({
    data,
    columns,
    fileName,
    sheetName,
    label = "Exportar a Excel",
    disabled = false,
}: ExcelExportButtonProps<TData>) {
    const [exporting, setExporting] = React.useState(false)

    async function handleExport() {
        setExporting(true)
        try {
            await exportToExcel({ data, columns, fileName, sheetName })
        } catch (error) {
            console.error(error)
            toast.error(error instanceof Error ? error.message : "No se pudo generar el archivo Excel")
        } finally {
            setExporting(false)
        }
    }

    return (
        <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled || exporting || data.length === 0}
            onClick={handleExport}
        >
            {exporting ? <Loader2 className="animate-spin" /> : <FileSpreadsheet className="text-emerald-700" />}
            {exporting ? "Generando..." : label}
        </Button>
    )
}
