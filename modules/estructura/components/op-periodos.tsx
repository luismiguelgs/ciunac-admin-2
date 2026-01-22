'use client'
import useOpciones from "../hooks/use-opciones";
import { IModulo } from "../interfaces/types.interface";
import { Collection } from "../services/opciones.service";
import { ColumnDef } from "@tanstack/react-table";
import { CheckIcon, XIcon, PencilIcon, TrashIcon } from "lucide-react"; // Consolidated lucide-react imports
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import { Suspense } from "react";
import { DataTableEditable } from "@/components/datatable/data-table-editable";
import { EditableCell } from "@/components/datatable/editable-cell";
import OpcionesService from "../services/opciones.service";
import React from "react";

//import { Checkbox } from "@/components/ui/checkbox"

const columns: ColumnDef<IModulo>[] = [
    {
        accessorKey: "nombre",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Nombre" />
        },
        cell: EditableCell,
    },
    {
        accessorKey: "fechaInicio",
        header: "Fecha Inicio",
        cell: EditableCell,
    },
    {
        accessorKey: "fechaFin",
        header: "Fecha Fin",
        cell: EditableCell,
    },
    {
        accessorKey: "orden",
        header: "Orden",
        cell: EditableCell,
    },
    {
        id: "actions",
        header: "Acciones",
        cell: ({ row, table }) => {
            const meta = table.options.meta as any
            const isEditing = meta?.editingRowId === row.id

            const handleEdit = () => {
                meta?.setEditingRowId(row.id)
            }

            const handleSave = async () => {
                const onRowUpdate = (meta as any).onRowUpdate
                if (onRowUpdate) {
                    await onRowUpdate(row.original)
                }
                meta?.setEditingRowId(null)
            }

            const handleCancel = () => {
                meta?.setEditingRowId(null)
                if (row.original.isNew) {
                    const setData = (meta as any).setData
                    setData((old: any[]) => old.filter((r) => r.id !== row.original.id))
                }
            }

            const handleDelete = async () => {
                const onRowDelete = (meta as any).onRowDelete
                if (onRowDelete) {
                    await onRowDelete(row.original.id)
                }
            }

            if (isEditing) {
                return (
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={handleSave}>
                            <CheckIcon className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={handleCancel}>
                            <XIcon className="h-4 w-4 text-red-600" />
                        </Button>
                    </div>
                )
            }

            return (
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={handleEdit}>
                        <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleDelete}>
                        <TrashIcon className="h-4 w-4 text-red-600" />
                    </Button>
                </div>
            )
        },
    },
    /*
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Seleccionar todo"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Seleccionar fila"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    }
    */
]

export default function OpPeriodos() {
    const { data, loading, setData } = useOpciones<IModulo>(Collection.Modulos);
    const [editingRowId, setEditingRowId] = React.useState<string | null>(null)

    const handleRowAdd = () => {
        const id = Math.floor(Math.random() * 90) + 10;
        const newRow: IModulo = {
            id,
            nombre: '',
            fechaInicio: new Date(),
            fechaFin: new Date(),
            orden: 0,
            isNew: true
        };
        setData((old) => [...old, newRow]);
        setEditingRowId(id.toString());
    }

    const handleRowDelete = async (id: number) => {
        if (confirm("¿Confirma borrar el registro?")) {
            await OpcionesService.deleteItem(Collection.Modulos, id);
            setData((old) => old.filter((row) => row.id !== id));
        }
    }

    const handleRowUpdate = async (newRow: IModulo) => {
        if (newRow.isNew) {
            const res = await OpcionesService.newItem(Collection.Modulos, newRow)
            const created = { ...newRow, id: (res as any).id, isNew: false }
            setData((old) => old.map((row) => (row.id === newRow.id ? created : row)))
        } else {
            console.log(newRow)
            await OpcionesService.updateItem(Collection.Modulos, newRow)
            setData((old) => old.map((row) => (row.id === newRow.id ? newRow : row)))
        }
    }

    return (
        <div className="container mx-auto py-2">
            <Suspense fallback={<DataTableSkeleton />}>
                {loading ? (
                    <DataTableSkeleton />
                ) : (
                    <DataTableEditable
                        columns={columns}
                        data={data}
                        setData={setData}
                        filterColumn="nombre"
                        onRowAdd={handleRowAdd}
                        onRowUpdate={handleRowUpdate}
                        onRowDelete={handleRowDelete}
                        editingRowId={editingRowId}
                        setEditingRowId={setEditingRowId}
                    />
                )}
            </Suspense>
        </div>
    )
}