'use client'

import { ColumnDef } from "@tanstack/react-table"
import { IGrupo } from "../interfaces/grupo.interface"
import { DataTable } from "@/components/datatable/data-table"
import { Eye } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface GruposDataTableProps {
    data: IGrupo[]
}

const columns: ColumnDef<IGrupo>[] = [
    {
        accessorKey: "codigo",
        header: "Código",
    },
    {
        accessorKey: "modulo.nombre",
        header: "Módulo",
    },
    {
        accessorKey: "ciclo.nombre",
        header: "Ciclo",
    },
    {
        accessorKey: "docenteFullName",
        header: "Docente",
    },
    {
        accessorKey: "frecuencia",
        header: "Frecuencia",
    },
    {
        accessorKey: "modalidad",
        header: "Modalidad",
    },
    {
        id: "acciones",
        header: "Acciones",
        cell: ({ row }) => {
            const grupo = row.original
            return (
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`/grupos/${grupo.id}`}>
                            <Eye className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            )
        }
    },
]

export function GruposDataTable({ data }: GruposDataTableProps) {
    return (
        <DataTable
            columns={columns}
            data={data}
            filterColumn="codigo"
        />
    )
}
