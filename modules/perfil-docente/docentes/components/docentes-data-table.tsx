'use client'

import { ColumnDef } from "@tanstack/react-table"
import { IDocente } from "../docente.interface"
import { DataTable } from "@/components/datatable/data-table"
import { Eye } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface DocentesDataTableProps {
    data: IDocente[]
}

const columns: ColumnDef<IDocente>[] = [
    {
        accessorKey: "nombres",
        header: "Nombres",
    },
    {
        accessorKey: "apellidos",
        header: "Apellidos",
    },
    {
        accessorKey: "genero",
        header: "Genero",
    },
    {
        accessorKey: "celular",
        header: "Celular",
    },
    {
        accessorKey: "numeroDocumento",
        header: "Nro. Documento",
    },
    {
        accessorKey: "activo",
        header: "Activo",
    },
    {
        id: "acciones",
        header: "Acciones",
        cell: ({ row }) => {
            const docente = row.original
            return (
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`/perfil-docente/docentes/${docente.id}`}>
                            <Eye className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            )
        }
    },
]

export function DocentesDataTable({ data }: DocentesDataTableProps) {
    return (
        <DataTable
            columns={columns}
            data={data}
            filterColumn="apellidos"
        />
    )
}
