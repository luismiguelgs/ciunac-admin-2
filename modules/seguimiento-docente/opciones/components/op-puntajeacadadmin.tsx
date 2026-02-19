'use client'
import React, { Suspense, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { CheckIcon, XIcon, PencilIcon, TrashIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import { DataTableEditable } from "@/components/datatable/data-table-editable";
import { EditableCell } from "@/components/datatable/editable-cell";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { IPuntajesAcademicoAdmin, IAreasSeguimiento } from "../perfil-types.interface";
import { Collection, PerfilOpcionesService } from "../perfil-opciones.service";
import usePerfilOpciones from "../perfil-opciones.hook";

export default function OpPuntajeAcadAdmin() {
    const { data: areas } = usePerfilOpciones<IAreasSeguimiento>(Collection.AreasSeguimiento);
    const { data, loading, setData } = usePerfilOpciones<IPuntajesAcademicoAdmin>(Collection.PuntajesAcademicoAdmin);
    const [editingRowId, setEditingRowId] = React.useState<string | null>(null)

    const columns: ColumnDef<IPuntajesAcademicoAdmin>[] = useMemo(() => [
        {
            accessorKey: "nombre",
            header: ({ column }) => {
                return <DataTableColumnHeader column={column} title="Nombre" />
            },
            cell: EditableCell,
        },
        {
            accessorKey: "academicoAdministrativoId",
            header: "Área de Seguimiento",
            cell: (props) => {
                const { getValue, row, column, table } = props
                const initialValue = getValue() as number
                const meta = table.options.meta as any
                const isEditing = meta?.editingRowId === row.id

                if (isEditing) {
                    return (
                        <Select
                            defaultValue={initialValue?.toString()}
                            onValueChange={(value) => {
                                meta?.updateData(row.index, column.id, parseInt(value))
                            }}
                        >
                            <SelectTrigger className="h-8 w-full">
                                <SelectValue placeholder="Seleccione área" />
                            </SelectTrigger>
                            <SelectContent>
                                {areas.map((area) => (
                                    <SelectItem key={area.id} value={area.id?.toString() || ""}>
                                        {area.nombre}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )
                }

                const area = areas.find(a => a.id === initialValue)
                return <span>{area?.nombre || row.original.academicoAdministrativo?.nombre || "-"}</span>
            },
        },
        {
            accessorKey: "puntaje",
            header: ({ column }) => {
                return <DataTableColumnHeader column={column} title="Puntaje" />
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
    ], [areas]);

    const handleRowAdd = () => {
        const id = Math.floor(Math.random() * 9000) + 1000;
        const newRow: IPuntajesAcademicoAdmin & { isNew?: boolean } = {
            id,
            nombre: '',
            puntaje: 0,
            academicoAdministrativoId: areas[0]?.id || 0,
            academicoAdministrativo: areas[0],
            isNew: true
        };
        setData((old) => [...old, newRow]);
        setEditingRowId(id.toString());
    }

    const handleRowDelete = async (id: number) => {
        if (confirm("¿Confirma borrar el registro?")) {
            await PerfilOpcionesService.deleteItem(Collection.PuntajesAcademicoAdmin, id);
            setData((old) => old.filter((row) => row.id !== id));
        }
    }

    const handleRowUpdate = async (newRow: IPuntajesAcademicoAdmin & { isNew?: boolean }) => {
        if (newRow.isNew) {
            const { isNew, academicoAdministrativo, ...payload } = newRow;
            const res = await PerfilOpcionesService.newItem(Collection.PuntajesAcademicoAdmin, payload)
            const created = { ...newRow, id: (res as any).id, isNew: false }
            setData((old) => old.map((row) => (row.id === newRow.id ? created : row)))
        } else {
            const { isNew, academicoAdministrativo, ...payload } = newRow;
            await PerfilOpcionesService.updateItem(Collection.PuntajesAcademicoAdmin, payload)
            setData((old) => old.map((row) => (row.id === newRow.id ? newRow : row)))
        }
    }

    return (
        <div className="container mx-auto py-2">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Puntajes Académico-Administrativos</h2>
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