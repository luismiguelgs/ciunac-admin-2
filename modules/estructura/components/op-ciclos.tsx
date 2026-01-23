'use client'
import useOpciones from "../hooks/use-opciones";
import ICiclo from "../interfaces/ciclo.interface";
import { IIdioma, INivel } from "../interfaces/types.interface";
import { Collection } from "../services/opciones.service";
import { ColumnDef } from "@tanstack/react-table";
import { CheckIcon, XIcon, PencilIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import { Suspense } from "react";
import { DataTableEditable } from "@/components/datatable/data-table-editable";
import { EditableCell } from "@/components/datatable/editable-cell";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import OpcionesService from "../services/opciones.service";
import React from "react";

export default function OpCiclos() {
    const { data, loading, setData } = useOpciones<ICiclo>(Collection.Ciclos);
    const { data: idiomas } = useOpciones<IIdioma>(Collection.Idiomas);
    const { data: niveles } = useOpciones<INivel>(Collection.Niveles);

    const [editingRowId, setEditingRowId] = React.useState<string | null>(null)

    const columns = React.useMemo<ColumnDef<ICiclo>[]>(() => [
        {
            accessorKey: "nombre",
            header: ({ column }) => {
                return <DataTableColumnHeader column={column} title="Nombre" />
            },
            cell: EditableCell,
        },
        {
            accessorKey: "numeroCiclo",
            header: "N° Ciclo",
            cell: EditableCell,
        },
        {
            accessorKey: "idiomaId",
            header: "Idioma",
            cell: (props) => {
                const { row, table } = props
                const meta = table.options.meta as any
                const isEditing = meta?.editingRowId === row.id
                if (isEditing) {
                    return (
                        <Select
                            defaultValue={row.original.idiomaId?.toString()}
                            onValueChange={(value) => {
                                meta?.updateData(row.index, "idiomaId", parseInt(value))
                            }}
                        >
                            <SelectTrigger className="h-8 w-[150px]">
                                <SelectValue placeholder="Idioma" />
                            </SelectTrigger>
                            <SelectContent>
                                {idiomas.map((idioma) => (
                                    <SelectItem key={idioma.id} value={idioma.id!.toString()}>
                                        {idioma.nombre}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )
                }
                return <span>{row.original.idioma?.nombre || row.original.idiomaId}</span>
            },
        },
        {
            accessorKey: "nivelId",
            header: "Nivel",
            cell: (props) => {
                const { row, table } = props
                const meta = table.options.meta as any
                const isEditing = meta?.editingRowId === row.id
                if (isEditing) {
                    return (
                        <Select
                            defaultValue={row.original.nivelId?.toString()}
                            onValueChange={(value) => {
                                meta?.updateData(row.index, "nivelId", parseInt(value))
                            }}
                        >
                            <SelectTrigger className="h-8 w-[150px]">
                                <SelectValue placeholder="Nivel" />
                            </SelectTrigger>
                            <SelectContent>
                                {niveles.map((nivel) => (
                                    <SelectItem key={nivel.id} value={nivel.id!.toString()}>
                                        {nivel.nombre}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )
                }
                return <span>{row.original.nivel?.nombre || row.original.nivelId}</span>
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
                        <Button variant="ghost" size="icon" onClick={handleDelete} disabled>
                            <TrashIcon className="h-4 w-4 text-red-600" />
                        </Button>
                    </div>
                )
            },
        },
    ], [idiomas, niveles]);

    const handleRowAdd = () => {
        const id = Math.floor(Math.random() * 90) + 10;
        const newRow: ICiclo = {
            id,
            nombre: '',
            numeroCiclo: 0,
            idiomaId: 0,
            nivelId: 0,
            isNew: true
        };
        setData((old) => [...old, newRow]);
        setEditingRowId(id.toString());
    }

    const handleRowDelete = async (id: number) => {
        if (confirm("¿Confirma borrar el registro?")) {
            await OpcionesService.deleteItem(Collection.Ciclos, id);
            setData((old) => old.filter((row) => row.id !== id));
        }
    }

    const handleRowUpdate = async (newRow: ICiclo) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { idioma, nivel, ...sanitizedRow } = newRow as any;

        const findIdioma = idiomas.find(i => i.id === newRow.idiomaId);
        const findNivel = niveles.find(n => n.id === newRow.nivelId);
        const updatedRow = { ...newRow, idioma: findIdioma, nivel: findNivel } as any;

        if (newRow.isNew) {
            const res = await OpcionesService.newItem(Collection.Ciclos, sanitizedRow)
            const created = { ...updatedRow, id: (res as any).id, isNew: false }
            setData((old) => old.map((row) => (row.id === newRow.id ? created : row)))
        } else {
            await OpcionesService.updateItem(Collection.Ciclos, sanitizedRow)
            setData((old) => old.map((row) => (row.id === newRow.id ? updatedRow : row)))
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
