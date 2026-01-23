'use client'
import { ITexto } from "../interfaces/types.interface";
import TextosService from "../services/textos.service";
import { ColumnDef } from "@tanstack/react-table";
import { CheckIcon, XIcon, PencilIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import { Suspense, useEffect, useState } from "react";
import { DataTableEditable } from "@/components/datatable/data-table-editable";
import { EditableCell } from "@/components/datatable/editable-cell";
import { Textarea } from "@/components/ui/textarea"
import React from "react";

const columns: ColumnDef<ITexto>[] = [
    {
        accessorKey: "codigo",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Código" />
        },
        cell: EditableCell,
    },
    {
        accessorKey: "contenido",
        header: "Contenido",
        cell: (props) => {
            const { getValue, row, column, table } = props
            const initialValue = getValue() as string
            const meta = table.options.meta as any
            const isEditing = meta?.editingRowId === row.id

            if (isEditing) {
                return (
                    <Textarea
                        value={initialValue}
                        onChange={(e) => {
                            meta?.updateData(row.index, column.id, e.target.value)
                        }}
                        className="min-h-20"
                    />
                )
            }

            return <div className="max-w-md truncate whitespace-pre-wrap">{initialValue}</div>
        },
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
                const rowOriginal = row.original as any
                if (rowOriginal.isNew) {
                    const setData = (meta as any).setData
                    setData((old: any[]) => old.filter((r) => r.id !== rowOriginal.id))
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
                    <Button variant="ghost" size="icon" onClick={handleDelete} disabled>
                        <TrashIcon className="h-4 w-4 text-red-600" />
                    </Button>
                </div>
            )
        },
    },
]

export default function OpTextos() {
    const [data, setData] = useState<ITexto[]>([])
    const [loading, setLoading] = useState(true)
    const [editingRowId, setEditingRowId] = React.useState<string | null>(null)

    const fetchTextos = async () => {
        setLoading(true)
        try {
            const res = await TextosService.fetchItems()
            // Normalize ID for DataTableEditable
            const normalized = res.map((item: any) => ({
                ...item,
                id: item.id ?? item._id
            }))
            setData(normalized)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTextos()
    }, [])

    const handleRowAdd = () => {
        const id = (Math.floor(Math.random() * 90) + 10).toString();
        const newRow: any = {
            id,
            codigo: '',
            contenido: '',
            isNew: true
        };
        setData((old) => [...old, newRow]);
        setEditingRowId(id);
    }

    const handleRowDelete = async (id: any) => {
        if (confirm("¿Confirma borrar el registro?")) {
            await TextosService.deleteItem(id);
            setData((old) => old.filter((row: any) => row.id !== id));
        }
    }

    const handleRowUpdate = async (newRow: ITexto) => {
        const rowAsAny = newRow as any;

        if (rowAsAny.isNew) {
            const res = await TextosService.newItem(newRow)
            const created = { ...newRow, id: (res as any).id, isNew: false } as any
            setData((old) => old.map((row) => (row.id === newRow.id ? created : row)))
        } else {
            await TextosService.updateItem(newRow)
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
                        setData={setData as any}
                        filterColumn="codigo"
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
