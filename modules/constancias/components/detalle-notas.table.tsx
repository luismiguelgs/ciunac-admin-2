'use client'

import React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { IConstanciaDetalle } from "../constancias.interface"
import { DataTableEditable } from "@/components/datatable/data-table-editable"
import { EditableCell } from "@/components/datatable/editable-cell"
import { Button } from "@/components/ui/button"
import { Trash2, Pencil, Save, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import useOpciones from "@/modules/estructura/hooks/use-opciones"
import { Collection } from "@/modules/estructura/services/opciones.service"
import { IIdioma, INivel } from "@/modules/estructura/interfaces/types.interface"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// Component for Detalle de Notas

interface DetalleNotasTableProps {
    detalle: IConstanciaDetalle[]
    onChange: (detalle: IConstanciaDetalle[]) => void
    disabled?: boolean
    ciclo?: number | string | null
    idioma?: string | null
    nivel?: string | null
}

export function DetalleNotasTable({
    detalle,
    onChange,
    disabled = false,
    ciclo,
    idioma,
    nivel,
}: DetalleNotasTableProps) {
    const [data, setData] = React.useState<IConstanciaDetalle[]>(detalle)
    const [editingRowId, setEditingRowId] = React.useState<string | null>(null)

    const { data: idiomas, loading: loadingIdiomas } = useOpciones<IIdioma>(Collection.Idiomas)
    const { data: niveles, loading: loadingNiveles } = useOpciones<INivel>(Collection.Niveles)

    // Sync parent when data changes
    React.useEffect(() => {
        onChange(data)
    }, [data])

    // Sync from parent when detalle changes externally
    React.useEffect(() => {
        setData(detalle)
    }, [detalle])

    const handleRowAdd = () => {
        const parsedCycle = Math.trunc(Number(ciclo))
        const cycleCount = Number.isFinite(parsedCycle) && parsedCycle > 1 ? parsedCycle : 1
        const existingCycles = new Set(
            data
                .map(row => Math.trunc(Number(row.ciclo)))
                .filter(value => Number.isFinite(value) && value >= 1)
        )
        const missingCycles = Array.from(
            { length: cycleCount },
            (_, index) => index + 1
        ).filter(value => !existingCycles.has(value))

        if (missingCycles.length === 0) {
            toast.info("Todos los ciclos ya tienen una fila de detalle")
            return
        }

        const currentYear = new Date().getFullYear().toString()
        const newRows: IConstanciaDetalle[] = missingCycles.map(cycleNumber => ({
            id: crypto.randomUUID(),
            idioma: idioma || '',
            nivel: nivel || '',
            ciclo: String(cycleNumber),
            modalidad: 'REGULAR',
            mes: '',
            año: currentYear,
            aprobado: true,
            nota: 0,
            isNew: true,
        }))

        setData(prev => [...prev, ...newRows])
        setEditingRowId(newRows[0].id!)
    }

    const handleRowUpdate = async (newRow: IConstanciaDetalle) => {
        // Usamos el ID para encontrar la fila en el estado más reciente de 'data'
        // Esto evita problemas si 'newRow' está desactualizado por una carrera con onBlur
        setData(prev => prev.map(r => (r.id === newRow.id ? { ...r, isNew: false } : r)))
        setEditingRowId(null)
    }

    const handleRowDelete = async (id: string) => {
        setData(prev => prev.filter(r => r.id !== id))
        if (editingRowId === id) setEditingRowId(null)
    }

    const columns: ColumnDef<IConstanciaDetalle>[] = React.useMemo(() => [
        {
            accessorKey: "idioma",
            header: "Idioma / Nivel",
            cell: ({ getValue, row, column, table }: any) => {
                const isEditing = table.options.meta?.editingRowId === row.id
                const value = getValue() as string

                if (isEditing) {
                    return (
                        <div className="flex items-center gap-2">
                            <Select
                                value={value}
                                onValueChange={(v) => table.options.meta?.updateData(row.index, column.id, v)}
                                disabled={loadingIdiomas}
                            >
                                <SelectTrigger className="h-9 w-32">
                                    <SelectValue placeholder={loadingIdiomas ? "..." : "Idioma"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {idiomas?.map((item) => (
                                        <SelectItem key={item.id} value={item.nombre}>
                                            {item.nombre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select
                                value={row.original.nivel}
                                onValueChange={(v) => table.options.meta?.updateData(row.index, "nivel", v)}
                                disabled={loadingNiveles}
                            >
                                <SelectTrigger className="h-9 w-32">
                                    <SelectValue placeholder={loadingNiveles ? "..." : "Nivel"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {niveles?.map((item) => (
                                        <SelectItem key={item.id} value={item.nombre}>
                                            {item.nombre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )
                }

                const getNivelName = (val: string | number) => {
                    if (!val) return ''
                    const nivel = niveles?.find(n => n.id === val || n.nombre === val || String(n.id) === String(val))
                    return nivel?.nombre || val
                }

                const getIdiomaName = (val: string | number) => {
                    if (!val) return ''
                    const idioma = idiomas?.find(i => i.id === val || i.nombre === val || String(i.id) === String(val))
                    return idioma?.nombre || val
                }

                return (
                    <div className="flex flex-col">
                        <span className="font-bold text-sm uppercase">{getIdiomaName(value)}</span>
                        <span className="text-[11px] text-muted-foreground font-medium">{getNivelName(row.original.nivel)}</span>
                    </div>
                )
            },
        },
        {
            accessorKey: "ciclo",
            header: "Ciclo / Modalidad",
            cell: ({ getValue, row, column, table }: any) => {
                const isEditing = table.options.meta?.editingRowId === row.id
                const value = getValue() as string

                if (isEditing) {
                    return (
                        <div className="flex items-center gap-2">
                            <EditableCell getValue={() => value} row={row} column={column} table={table} className="w-12" />
                            <Select
                                value={row.original.modalidad}
                                onValueChange={(v) => table.options.meta?.updateData(row.index, "modalidad", v)}
                            >
                                <SelectTrigger className="h-9 w-28">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="REGULAR">Regular</SelectItem>
                                    <SelectItem value="INTENSIVO">Intensivo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )
                }
                return (
                    <div className="flex flex-col">
                        <span className="font-medium text-sm">Ciclo {value}</span>
                        <Badge variant="outline" className="w-fit text-[9px] py-0 h-4 mt-1 opacity-70">
                            {row.original.modalidad}
                        </Badge>
                    </div>
                )
            },
        },
        {
            accessorKey: "mes",
            header: "Periodo",
            cell: ({ getValue, row, column, table }: any) => {
                const isEditing = table.options.meta?.editingRowId === row.id
                if (isEditing) {
                    return (
                        <div className="flex gap-1">
                            <EditableCell getValue={() => row.original.mes} row={row} column={{ ...column, id: 'mes' }} table={table} className="w-12" />
                            <EditableCell getValue={() => row.original.año} row={row} column={{ ...column, id: 'año' }} table={table} className="w-16" />
                        </div>
                    )
                }
                return (
                    <div className="flex items-center gap-1.5 text-sm font-medium">
                        <span className="capitalize">{row.original.mes}</span>
                        <span className="text-muted-foreground">{row.original.año}</span>
                    </div>
                )
            },
        },
        {
            accessorKey: "nota",
            header: "Calificación",
            cell: ({ getValue, row, column, table }: any) => {
                const isEditing = table.options.meta?.editingRowId === row.id
                const value = getValue() as number
                const aprobado = row.original.aprobado

                if (isEditing) {
                    return (
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase">Nota:</span>
                                <EditableCell getValue={() => value} row={row} column={column} table={table} className="w-12 text-center font-bold" />
                            </div>
                            <Select
                                value={aprobado ? "true" : "false"}
                                onValueChange={(v) => table.options.meta?.updateData(row.index, "aprobado", v === "true")}
                            >
                                <SelectTrigger className="h-9 w-28">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="true">Aprobado</SelectItem>
                                    <SelectItem value="false">Reprobado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )
                }
                return (
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "flex items-center justify-center w-10 h-10 rounded-full border-2 font-bold text-sm shadow-sm",
                            aprobado ? "border-green-100 bg-green-50 text-green-700" : "border-red-100 bg-red-50 text-red-700"
                        )}>
                            {value.toString().padStart(2, '0')}
                        </div>
                        <Badge className={cn(
                            "text-[10px] font-bold py-0 h-5",
                            aprobado ? "bg-green-500/10 text-green-700 hover:bg-green-500/20 border-green-200" : "bg-red-500/10 text-red-700 hover:bg-red-500/20 border-red-200"
                        )} variant="outline">
                            {aprobado ? "APROBADO" : "REPROBADO"}
                        </Badge>
                    </div>
                )
            },
        },
        {
            id: "acciones",
            header: "",
            cell: ({ row, table }: any) => {
                if (disabled) return null
                const isEditing = table.options.meta?.editingRowId === row.id
                const rowData = row.original as IConstanciaDetalle

                if (isEditing) {
                    return (
                        <div className="flex items-center gap-1 justify-end">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-9 w-9 rounded-full bg-green-50 hover:bg-green-100 text-green-600"
                                            onClick={() => table.options.meta?.onRowUpdate?.(rowData)}
                                        >
                                            <Save className="h-4.5 w-4.5" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Guardar Cambios</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-9 w-9 rounded-full hover:bg-muted"
                                            onClick={() => {
                                                if (rowData.isNew) {
                                                    table.options.meta?.onRowDelete?.(rowData.id)
                                                } else {
                                                    table.options.meta?.setEditingRowId(null)
                                                }
                                            }}
                                        >
                                            <X className="h-4.5 w-4.5" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Descartar</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    )
                }

                return (
                    <div className="flex items-center gap-1 justify-end">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full hover:bg-primary/5 hover:text-primary"
                            onClick={() => table.options.meta?.setEditingRowId(row.id)}
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full hover:bg-red-50 hover:text-red-600"
                            onClick={() => table.options.meta?.onRowDelete?.(rowData.id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                )
            }
        }
    ], [idiomas, niveles, loadingIdiomas, loadingNiveles, disabled, editingRowId])

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-1 px-1">
                <h3 className="text-lg font-bold tracking-tight">Detalle de Notas</h3>
                <p className="text-sm text-muted-foreground">
                    Ingrese las calificaciones del estudiante por cada nivel cursado.
                </p>
            </div>
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden p-1">
                <DataTableEditable
                    columns={columns}
                    data={data}
                    setData={setData}
                    filterColumn="idioma"
                    onRowUpdate={handleRowUpdate}
                    onRowDelete={handleRowDelete}
                    onRowAdd={disabled ? undefined : handleRowAdd}
                    editingRowId={editingRowId}
                    setEditingRowId={setEditingRowId}
                    highlightUnsavedRows={true}
                    pageSize={20}
                />
            </div>
        </div>
    )
}
