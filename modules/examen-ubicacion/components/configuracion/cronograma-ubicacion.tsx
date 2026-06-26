'use client'

import React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { toast } from "sonner"
import { CheckIcon, PencilIcon, TrashIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DataTableEditable } from "@/components/datatable/data-table-editable"
import { EditableCell } from "@/components/datatable/editable-cell"
import { ConfirmDeleteDialog } from "@/components/dialogs/confirm-delete-dialog"
import useOpciones from "@/modules/estructura/hooks/use-opciones"
import { IModulo } from "@/modules/estructura/interfaces/types.interface"
import { Collection } from "@/modules/estructura/services/opciones.service"
import ICronogramaUbicacion from "../../interfaces/cronograma-ubicacion.interface"
import CronogramaUbicacionService from "../../services/cronograma-ubicacion.service"

interface CronogramaUbicacionProps {
    initialData: ICronogramaUbicacion[]
}

export function CronogramaUbicacion({ initialData }: CronogramaUbicacionProps) {
    const { data: modulos } = useOpciones<IModulo>(Collection.Modulos)
    const [data, setData] = React.useState(initialData)
    const [editingRowId, setEditingRowId] = React.useState<string | null>(null)
    const [deleteId, setDeleteId] = React.useState<number | null>(null)

    React.useEffect(() => setData(initialData), [initialData])

    const handleActiveChange = async (row: ICronogramaUbicacion, activo: boolean) => {
        if (!row.id) return
        setData((current) => current.map((item) => item.id === row.id ? { ...item, activo } : item))
        try {
            await CronogramaUbicacionService.updateStatus(row.id, activo)
            toast.success("Cronograma actualizado")
        } catch (error) {
            console.error(error)
            toast.error("No se pudo actualizar el estado")
        }
    }

    const columns = React.useMemo<ColumnDef<ICronogramaUbicacion>[]>(() => [
        {
            accessorKey: "moduloId",
            header: "Periodo",
            cell: ({ row, table }) => {
                const meta = table.options.meta as any
                const isEditing = meta?.editingRowId === row.id
                const modulo = modulos.find((item) => item.id === row.original.moduloId)

                if (!isEditing) return <span>{modulo?.nombre ?? row.original.modulo?.nombre ?? row.original.moduloId}</span>

                return (
                    <Select
                        defaultValue={String(row.original.moduloId || "")}
                        onValueChange={(value) => meta?.updateData(row.index, "moduloId", Number(value))}
                    >
                        <SelectTrigger className="h-8 min-w-44">
                            <SelectValue placeholder="Modulo" />
                        </SelectTrigger>
                        <SelectContent>
                            {modulos.map((item) => (
                                <SelectItem key={item.id} value={String(item.id)}>
                                    {item.nombre}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )
            }
        },
        { accessorKey: "fecha", header: "Fecha del Examen", cell: EditableCell, meta: { type: "date" } },
        {
            accessorKey: "activo",
            header: "Activo",
            cell: ({ row }) => (
                <Checkbox
                    checked={Boolean(row.original.activo)}
                    onCheckedChange={(checked) => handleActiveChange(row.original, checked === true)}
                />
            )
        },
        {
            id: "actions",
            header: "Acciones",
            cell: ({ row, table }) => {
                const meta = table.options.meta as any
                const isEditing = meta?.editingRowId === row.id
                if (isEditing) {
                    return (
                        <div className="flex gap-2">
                            <Button variant="ghost" size="icon" onClick={async () => {
                                await meta?.onRowUpdate(row.original)
                                meta?.setEditingRowId(null)
                            }}>
                                <CheckIcon className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => {
                                meta?.setEditingRowId(null)
                                if (row.original.isNew) meta?.setData((old: ICronogramaUbicacion[]) => old.filter((item) => item.id !== row.original.id))
                            }}>
                                <XIcon className="h-4 w-4 text-red-600" />
                            </Button>
                        </div>
                    )
                }
                return (
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => meta?.setEditingRowId(row.id)}>
                            <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteId(row.original.id ?? null)}>
                            <TrashIcon className="h-4 w-4 text-red-600" />
                        </Button>
                    </div>
                )
            }
        }
    ], [modulos])

    const handleRowAdd = () => {
        const id = Math.floor(Math.random() * 9000) + 1000
        const newRow: ICronogramaUbicacion = {
            id,
            moduloId: modulos[0]?.id ?? 0,
            fecha: new Date().toISOString().split("T")[0],
            activo: false,
            isNew: true,
        }
        setData((current) => [...current, newRow])
        setEditingRowId(String(id))
    }

    const handleRowUpdate = async (row: ICronogramaUbicacion) => {
        const payload = {
            moduloId: Number(row.moduloId),
            fecha: new Date(row.fecha).toISOString().split("T")[0],
            activo: Boolean(row.activo),
        }
        try {
            if (row.isNew) {
                const created = await CronogramaUbicacionService.create(payload)
                setData((current) => current.map((item) => item.id === row.id ? { ...row, ...created, isNew: false } : item))
            } else {
                await CronogramaUbicacionService.update(row.id!, payload)
                setData((current) => current.map((item) => item.id === row.id ? { ...row, ...payload, isNew: false } : item))
            }
            toast.success("Cronograma guardado")
        } catch (error) {
            console.error(error)
            toast.error("No se pudo guardar el cronograma")
        }
    }

    const handleDelete = async () => {
        if (!deleteId) return
        try {
            await CronogramaUbicacionService.delete(deleteId)
            setData((current) => current.filter((item) => item.id !== deleteId))
            setDeleteId(null)
            toast.success("Cronograma eliminado")
        } catch (error) {
            console.error(error)
            toast.error("No se pudo eliminar el cronograma")
        }
    }

    return (
        <React.Fragment>
            <DataTableEditable
                columns={columns}
                data={data}
                setData={setData}
                filterColumn="moduloId"
                onRowAdd={handleRowAdd}
                onRowUpdate={handleRowUpdate}
                editingRowId={editingRowId}
                setEditingRowId={setEditingRowId}
                highlightUnsavedRows
            />
            <ConfirmDeleteDialog
                isOpen={Boolean(deleteId)}
                onOpenChange={(open) => {
                    if (!open) setDeleteId(null)
                }}
                onConfirm={handleDelete}
                title="Eliminar cronograma"
                description="Esta accion eliminara la fecha configurada."
            />
        </React.Fragment>
    )
}
