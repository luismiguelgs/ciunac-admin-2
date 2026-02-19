'use client'
import React, { Suspense } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { CheckIcon, XIcon, PencilIcon, TrashIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import { DataTableEditable } from "@/components/datatable/data-table-editable";
import { EditableCell } from "@/components/datatable/editable-cell";

import { IAreasSeguimiento } from "../perfil-types.interface";
import { Collection, PerfilOpcionesService } from "../perfil-opciones.service";
import usePerfilOpciones from "../perfil-opciones.hook";

const columns: ColumnDef<IAreasSeguimiento>[] = [
    {
        accessorKey: "nombre",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Nombre" />
        },
        cell: EditableCell,
    },
    {
        accessorKey: "peso",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Peso" />
        },
        cell: (props) => <EditableCell {...props} type="number" />,
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
                if ((row.original as any).isNew) {
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
]

export default function OpAreasSeguimiento() {
    const { data, loading, setData } = usePerfilOpciones<IAreasSeguimiento>(Collection.AreasSeguimiento);
    const [editingRowId, setEditingRowId] = React.useState<string | null>(null)

    const handleRowAdd = () => {
        const id = Math.floor(Math.random() * 9000) + 1000;
        const newRow: IAreasSeguimiento & { isNew?: boolean } = {
            id,
            nombre: '',
            peso: 0,
            isNew: true
        };
        setData((old) => [...old, newRow]);
        setEditingRowId(id.toString());
    }

    const handleRowDelete = async (id: number) => {
        if (confirm("¿Confirma borrar el registro?")) {
            await PerfilOpcionesService.deleteItem(Collection.AreasSeguimiento, id);
            setData((old) => old.filter((row) => row.id !== id));
        }
    }

    const handleRowUpdate = async (newRow: IAreasSeguimiento & { isNew?: boolean }) => {
        if (newRow.isNew) {
            const { isNew, ...payload } = newRow;
            const res = await PerfilOpcionesService.newItem(Collection.AreasSeguimiento, payload)
            const created = { ...payload, id: (res as any).id, isNew: false }
            setData((old) => old.map((row) => (row.id === newRow.id ? created : row)))
        } else {
            const { isNew, ...payload } = newRow;
            await PerfilOpcionesService.updateItem(Collection.AreasSeguimiento, payload)
            setData((old) => old.map((row) => (row.id === newRow.id ? payload : row)))
        }
    }

    return (
        <div className="container mx-auto py-2">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Áreas de Seguimiento</h2>
            </div>
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
