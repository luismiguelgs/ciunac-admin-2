'use client'

import React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/datatable/data-table"
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton"
import { getItemByCode } from "@/lib/common"
import ICalificacionUbicacion from "../interfaces/calificacion.interface"
import { IDetalleExamenUbicacion, IExamenUbicacion } from "../interfaces/examen-ubicacion.interface"
import { formatUbicacionFromCalificacion } from "../examen-ubicacion.utils"

interface ParticipantsGlobalTableProps {
    data: IDetalleExamenUbicacion[]
    exams: IExamenUbicacion[]
    calificaciones: ICalificacionUbicacion[]
}

function formatExamDate(value?: string | Date) {
    if (!value) return "N/A"

    if (typeof value === "string") {
        const datePart = value.split("T")[0]
        const [year, month, day] = datePart.split("-")
        if (year && month && day && !Number.isNaN(Number(year)) && !Number.isNaN(Number(month)) && !Number.isNaN(Number(day))) {
            const yearNumber = Number(year)
            const monthNumber = Number(month)
            const dayNumber = Number(day)
            const date = new Date(Date.UTC(yearNumber, monthNumber - 1, dayNumber))

            if (
                date.getUTCFullYear() === yearNumber &&
                date.getUTCMonth() === monthNumber - 1 &&
                date.getUTCDate() === dayNumber
            ) {
                return `${year.padStart(4, "0")}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
            }
        }
    }

    const date = new Date(value)
    if (isNaN(date.getTime())) return "N/A"

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")

    return `${year}-${month}-${day}`
}

export function ParticipantsGlobalTable({ data, exams, calificaciones }: ParticipantsGlobalTableProps) {
    const examById = React.useMemo(() => new Map(exams.map((exam) => [exam.id, exam])), [exams])
    const calificacionById = React.useMemo(() => {
        return new Map(calificaciones.map((calificacion) => [calificacion.id, calificacion]))
    }, [calificaciones])

    const columns: ColumnDef<IDetalleExamenUbicacion>[] = [
        {
            id: "busqueda",
            accessorFn: (row) => [
                row.estudiante?.apellidos,
                row.estudiante?.nombres,
                row.estudiante?.numeroDocumento,
            ].filter(Boolean).join(" "),
            enableHiding: false,
        },
        {
            id: "idioma",
            header: "Idioma",
            accessorFn: (row) => row.idioma?.nombre ?? String(row.idiomaId ?? ""),
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    {getItemByCode(row.original.idiomaId, row.original.idioma?.nombre ?? "Idioma")}
                    {row.original.idioma?.nombre ?? row.original.idiomaId}
                </div>
            )
        },
        {
            id: "fecha",
            header: "Fecha Examen",
            accessorFn: (row) => formatExamDate(examById.get(row.examenId)?.fecha),
        },
        {
            id: "apellidos",
            header: "Apellidos",
            accessorFn: (row) => row.estudiante?.apellidos ?? ""
        },
        {
            id: "nombres",
            header: "Nombres",
            accessorFn: (row) => row.estudiante?.nombres ?? ""
        },
        {
            id: "documento",
            header: "Documento",
            accessorFn: (row) => row.estudiante?.numeroDocumento ?? ""
        },
        { accessorKey: "nota", header: "Nota" },
        {
            id: "ubicacion",
            header: "Ubicacion",
            accessorFn: (row) => formatUbicacionFromCalificacion(calificacionById.get(row.calificacionId))
        }
    ]

    return (
        <React.Suspense fallback={<DataTableSkeleton />}>
            <DataTable
                columns={columns}
                data={data}
                filterColumn="busqueda"
                pageSize={20}
                searchPlaceholder="Buscar por apellidos, nombres o DNI..."
                initialColumnVisibility={{ busqueda: false }}
            />
        </React.Suspense>
    )
}
