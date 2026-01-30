'use client'

import React from "react";
import ImportForm from "../forms/import.form";
import { DataTable } from "@/components/datatable/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { ICursoQ10 } from "../interfaces/cursoq10.interface";

const columns: ColumnDef<ICursoQ10>[] = [
    {
        accessorKey: "Codigo",
        header: "Código",
    },
    {
        accessorKey: "Nombre",
        header: "Nombre",
    },
    {
        accessorKey: "Nombre_periodo",
        header: "Periodo",
    },
    {
        accessorKey: "Nombre_docente",
        header: "Docente",
    },
    {
        accessorKey: "Cantidad_estudiantes_matriculados",
        header: "Estudiantes",
    }
]

export default function ImportarGrupos() {
    const [cursos, setCursos] = React.useState<ICursoQ10[]>([]);

    const handleImport = (cursos: ICursoQ10[]) => {
        setCursos(cursos);
    }

    return (
        <React.Fragment>
            <ImportForm onImport={handleImport} />
            <DataTable columns={columns} data={cursos} filterColumn="Codigo" />
        </React.Fragment>
    )
}