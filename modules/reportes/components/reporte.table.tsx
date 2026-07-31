"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/datatable/data-table"
import type { ReportKind, ReportSolicitud } from "../reportes.interface"
import { formatReportDate, getReportSearchValue } from "../reportes.utils"

const currencyFormatter = new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
})

const commonColumns: ColumnDef<ReportSolicitud>[] = [
    {
        id: "busqueda",
        accessorFn: getReportSearchValue,
        header: "Búsqueda",
        enableHiding: false,
        enableSorting: false,
    },
    {
        accessorKey: "creadoEn",
        header: "Fecha",
        cell: ({ row }) => formatReportDate(row.original.creadoEn),
    },
    {
        id: "estudiante",
        accessorFn: row => `${row.estudiante?.apellidos ?? ""} ${row.estudiante?.nombres ?? ""}`.trim(),
        header: "Estudiante",
        cell: ({ row }) => (
            <div className="min-w-48">
                <div className="font-medium">{row.original.estudiante?.apellidos || "-"}</div>
                <div className="text-xs text-muted-foreground">{row.original.estudiante?.nombres || "-"}</div>
            </div>
        ),
    },
    {
        id: "documento",
        accessorFn: row => row.estudiante?.numeroDocumento ?? "",
        header: "Documento",
        cell: ({ getValue }) => getValue<string>() || "-",
    },
    {
        id: "idioma",
        accessorFn: row => row.idioma?.nombre ?? "",
        header: "Idioma",
        cell: ({ getValue }) => getValue<string>() || "-",
    },
    {
        id: "nivel",
        accessorFn: row => row.nivel?.nombre ?? "",
        header: "Nivel",
        cell: ({ getValue }) => getValue<string>() || "-",
    },
    {
        id: "pago",
        accessorFn: row => Number(row.pago) || 0,
        header: "Abono",
        cell: ({ getValue }) => currencyFormatter.format(getValue<number>()),
    },
    {
        accessorKey: "numeroVoucher",
        header: "N.º recibo",
        cell: ({ getValue }) => getValue<string>() || "-",
    },
    {
        id: "estado",
        accessorFn: row => row.estado?.nombre ?? "",
        header: "Estado",
        cell: ({ getValue }) => <Badge variant="outline">{getValue<string>() || "Sin estado"}</Badge>,
    },
]

const tipoColumn: ColumnDef<ReportSolicitud> = {
    id: "tipoSolicitud",
    accessorFn: row => row.tiposSolicitud?.solicitud ?? "",
    header: "Tipo de solicitud",
    cell: ({ getValue }) => <span className="min-w-44 whitespace-normal">{getValue<string>() || "-"}</span>,
}

const documentColumns = [commonColumns[0], commonColumns[1], tipoColumn, ...commonColumns.slice(2)]

export function ReporteTable({ data, kind }: { data: ReportSolicitud[]; kind: ReportKind }) {
    return (
        <DataTable
            columns={kind === "documentos" ? documentColumns : commonColumns}
            data={data}
            filterColumn="busqueda"
            searchPlaceholder="Buscar por estudiante, documento, idioma o recibo..."
            initialColumnVisibility={{ busqueda: false }}
            pageSize={25}
            compact
        />
    )
}

