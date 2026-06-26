'use client'

import React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { toast } from "sonner"
import { CheckIcon, PencilIcon, TrashIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DataTableEditable } from "@/components/datatable/data-table-editable"
import { EditableCell } from "@/components/datatable/editable-cell"
import { ConfirmDeleteDialog } from "@/components/dialogs/confirm-delete-dialog"
import useOpciones from "@/modules/estructura/hooks/use-opciones"
import { Collection } from "@/modules/estructura/services/opciones.service"
import ICiclo from "@/modules/estructura/interfaces/ciclo.interface"
import ICalificacionUbicacion from "../../interfaces/calificacion.interface"
import CalificacionesUbicacionService from "../../services/calificaciones.service"

interface CalificacionesUbicacionProps {
    initialData: ICalificacionUbicacion[]
}

interface EditableCalificacionMeta {
    editingRowId: string | null
    setEditingRowId: React.Dispatch<React.SetStateAction<string | null>>
    setData: React.Dispatch<React.SetStateAction<ICalificacionUbicacion[]>>
    updateData: (rowIndex: number, columnId: string, value: unknown) => void
    onRowUpdate?: (row: ICalificacionUbicacion) => Promise<unknown>
}

export function CalificacionesUbicacion({ initialData }: CalificacionesUbicacionProps) {
    const { data: ciclos } = useOpciones<ICiclo>(Collection.Ciclos)
    const [data, setData] = React.useState(initialData)
    const [editingRowId, setEditingRowId] = React.useState<string | null>(null)
    const [deleteId, setDeleteId] = React.useState<number | null>(null)

    React.useEffect(() => setData(initialData), [initialData])

    const getCiclo = React.useCallback((calificacion: ICalificacionUbicacion) => {
        return ciclos.find((item) => item.id === calificacion.cicloId)
    }, [ciclos])

    const getIdiomaLabel = React.useCallback((calificacion: ICalificacionUbicacion) => {
        const ciclo = getCiclo(calificacion)

        return ciclo?.idioma?.nombre ?? calificacion.idioma?.nombre ?? ciclo?.idiomaId ?? calificacion.idiomaId ?? "Sin idioma"
    }, [getCiclo])

    const getNivelLabel = React.useCallback((calificacion: ICalificacionUbicacion) => {
        const ciclo = getCiclo(calificacion)

        return ciclo?.nivel?.nombre ?? calificacion.nivel?.nombre ?? ciclo?.nivelId ?? calificacion.nivelId ?? "Sin nivel"
    }, [getCiclo])

    const getCicloOptionLabel = React.useCallback((ciclo: ICiclo) => {
        const idioma = ciclo.idioma?.nombre ?? ciclo.idiomaId
        const nivel = ciclo.nivel?.nombre ?? ciclo.nivelId

        return `${idioma} - ${nivel} - ${ciclo.nombre}`
    }, [])

    const normalizeCiclo = React.useCallback((ciclo?: ICiclo) => {
        if (!ciclo?.id) return undefined
        return {
            id: ciclo.id,
            nombre: ciclo.nombre,
            numeroCiclo: ciclo.numeroCiclo,
            idiomaId: ciclo.idiomaId,
            nivelId: ciclo.nivelId,
        }
    }, [])

    const columns = React.useMemo<ColumnDef<ICalificacionUbicacion>[]>(() => [
        {
            id: "idioma",
            header: "Idioma",
            cell: ({ row }) => <span>{getIdiomaLabel(row.original)}</span>,
        },
        {
            id: "nivel",
            header: "Nivel",
            cell: ({ row }) => <span>{getNivelLabel(row.original)}</span>,
        },
        {
            accessorKey: "cicloId",
            header: "Ciclo",
            cell: ({ row, table }) => {
                const meta = table.options.meta as EditableCalificacionMeta | undefined
                const isEditing = meta?.editingRowId === row.id
                const ciclo = getCiclo(row.original)

                if (!isEditing) return <span>{ciclo?.nombre ?? row.original.ciclo?.nombre ?? row.original.cicloId}</span>

                return (
                    <Select
                        defaultValue={String(row.original.cicloId || "")}
                        onValueChange={(value) => meta?.updateData(row.index, "cicloId", Number(value))}
                    >
                        <SelectTrigger className="h-8 min-w-48">
                            <SelectValue placeholder="Ciclo" />
                        </SelectTrigger>
                        <SelectContent>
                            {ciclos.map((item) => (
                                <SelectItem key={item.id} value={String(item.id)}>
                                    {getCicloOptionLabel(item)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )
            }
        },
        { accessorKey: "notaMin", header: "Nota Min.", cell: EditableCell, meta: { type: "number" } },
        { accessorKey: "notaMax", header: "Nota Max.", cell: EditableCell, meta: { type: "number" } },
        {
            id: "actions",
            header: "Acciones",
            cell: ({ row, table }) => {
                const meta = table.options.meta as EditableCalificacionMeta | undefined
                const isEditing = meta?.editingRowId === row.id
                if (isEditing) {
                    return (
                        <div className="flex gap-2">
                            <Button variant="ghost" size="icon" onClick={async () => {
                                if (meta?.onRowUpdate) {
                                    await meta.onRowUpdate(row.original)
                                }
                                meta?.setEditingRowId(null)
                            }}>
                                <CheckIcon className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => {
                                meta?.setEditingRowId(null)
                                if (row.original.isNew) meta?.setData((old: ICalificacionUbicacion[]) => old.filter((item) => item.id !== row.original.id))
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
    ], [ciclos, getCiclo, getCicloOptionLabel, getIdiomaLabel, getNivelLabel])

    const handleRowAdd = () => {
        const id = Math.floor(Math.random() * 9000) + 1000
        const cicloId = ciclos[0]?.id ?? 0
        const newRow: ICalificacionUbicacion = {
            id,
            cicloId,
            idiomaId: ciclos[0]?.idiomaId,
            nivelId: ciclos[0]?.nivelId,
            notaMin: 0,
            notaMax: 0,
            isNew: true,
        }
        setData((current) => [...current, newRow])
        setEditingRowId(String(id))
    }

    const handleRowUpdate = async (row: ICalificacionUbicacion) => {
        const ciclo = ciclos.find((item) => item.id === row.cicloId)
        const payload = {
            cicloId: row.cicloId,
            idiomaId: ciclo?.idiomaId ?? row.idiomaId,
            nivelId: ciclo?.nivelId ?? row.nivelId,
            notaMin: Number(row.notaMin),
            notaMax: Number(row.notaMax),
        }
        try {
            if (row.isNew) {
                const created = await CalificacionesUbicacionService.create(payload)
                setData((current) => current.map((item) => item.id === row.id ? { ...row, ...created, isNew: false, ciclo: normalizeCiclo(ciclo) } : item))
            } else {
                await CalificacionesUbicacionService.update(row.id!, payload)
                setData((current) => current.map((item) => item.id === row.id ? { ...row, ...payload, ciclo: normalizeCiclo(ciclo), isNew: false } : item))
            }
            toast.success("Calificacion guardada")
        } catch (error) {
            console.error(error)
            toast.error("No se pudo guardar la calificacion")
        }
    }

    const handleDelete = async () => {
        if (!deleteId) return
        try {
            await CalificacionesUbicacionService.delete(deleteId)
            setData((current) => current.filter((item) => item.id !== deleteId))
            setDeleteId(null)
            toast.success("Calificacion eliminada")
        } catch (error) {
            console.error(error)
            toast.error("No se pudo eliminar la calificacion")
        }
    }

    return (
        <React.Fragment>
            <DataTableEditable
                columns={columns}
                data={data}
                setData={setData}
                filterColumn="cicloId"
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
                title="Eliminar calificacion"
                description="Esta accion eliminara el rango de ubicacion seleccionado."
            />
        </React.Fragment>
    )
}
