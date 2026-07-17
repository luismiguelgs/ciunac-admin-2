"use client"

import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { Pencil, Save, Trash2, X } from "lucide-react"
import { toast } from "sonner"
import { DataTableEditable } from "@/components/datatable/data-table-editable"
import { EditableCell } from "@/components/datatable/editable-cell"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type ICiclo from "@/modules/estructura/interfaces/ciclo.interface"
import type { ICertificadoNota, CertificadoModalidad } from "../certificado.interface"
import { getCurrentCertificatePeriod } from "../certificados.utils"

interface CertificadoNotasTableProps {
    notas: ICertificadoNota[]
    onChange: (notas: ICertificadoNota[]) => void
    ciclos: ICiclo[]
    idiomaId?: string
    nivelId?: string
    curriculaAnterior?: boolean
    disabled?: boolean
}

const MODALIDADES: Array<{ label: string; value: CertificadoModalidad }> = [
    { label: "Ciclo regular", value: "C.R." },
    { label: "Ciclo intensivo", value: "C.I." },
    { label: "Examen de ubicacion", value: "EX.U." },
]

interface CertificadoNotasTableMeta {
    editingRowId?: string | null
    updateData: (rowIndex: number, columnId: string, value: unknown) => void
    onRowUpdate?: (row: ICertificadoNota) => void
    onRowDelete?: (id: string) => void
    setEditingRowId: (id: string | null) => void
}

function getTableMeta(table: { options: { meta?: unknown } }): CertificadoNotasTableMeta | undefined {
    return table.options.meta as CertificadoNotasTableMeta | undefined
}

export function CertificadoNotasTable({
    notas,
    onChange,
    ciclos,
    idiomaId,
    nivelId,
    curriculaAnterior = false,
    disabled = false,
}: CertificadoNotasTableProps) {
    const [data, setData] = React.useState<ICertificadoNota[]>(notas)
    const [editingRowId, setEditingRowId] = React.useState<string | null>(null)

    React.useEffect(() => setData(notas), [notas])
    React.useEffect(() => onChange(data), [data, onChange])

    const availableCycles = React.useMemo(() => ciclos
        .filter(ciclo => String(ciclo.idiomaId) === idiomaId && String(ciclo.nivelId) === nivelId)
        .toSorted((a, b) => a.numeroCiclo - b.numeroCiclo), [ciclos, idiomaId, nivelId])

    function handleAdd() {
        const period = getCurrentCertificatePeriod()
        const existing = new Set(data.map(item => item.ciclo.trim().toLocaleUpperCase("es-PE")))
        const newRows: ICertificadoNota[] = curriculaAnterior
            ? [{ id: crypto.randomUUID(), ciclo: "", periodo: period, modalidad: "C.R.", nota: 0, isNew: true }]
            : availableCycles
                .filter(ciclo => !existing.has(ciclo.nombre.trim().toLocaleUpperCase("es-PE")))
                .map(ciclo => ({
                    id: crypto.randomUUID(),
                    ciclo: ciclo.nombre,
                    periodo: period,
                    modalidad: "C.R." as const,
                    nota: 0,
                    isNew: true,
                }))

        if (newRows.length === 0) {
            toast.info("Todos los ciclos del programa ya fueron agregados")
            return
        }

        setData(current => [...current, ...newRows])
        setEditingRowId(newRows[0].id!)
    }

    async function handleUpdate(row: ICertificadoNota) {
        if (!row.ciclo.trim() || !/^\d{4}-\d{2}$/.test(row.periodo) || row.nota < 0 || row.nota > 100) {
            toast.error("Complete ciclo, periodo YYYY-MM y una nota entre 0 y 100")
            return
        }
        setData(current => current.map(item => item.id === row.id ? { ...item, isNew: false, nota: Number(item.nota) } : item))
        setEditingRowId(null)
    }

    async function handleDelete(id: string) {
        setData(current => current.filter(item => item.id !== id))
        if (editingRowId === id) setEditingRowId(null)
    }

    const handleEdit = React.useCallback((row: ICertificadoNota) => {
        if (!disabled && row.id) setEditingRowId(row.id)
    }, [disabled])

    const columns = React.useMemo<ColumnDef<ICertificadoNota>[]>(() => [
        {
            accessorKey: "ciclo",
            header: "Curso",
            cell: ({ getValue, row, column, table }) => {
                const editing = getTableMeta(table)?.editingRowId === row.id
                const value = getValue() as string
                if (editing && !curriculaAnterior && availableCycles.length) {
                    return (
                        <Select value={value} onValueChange={next => getTableMeta(table)?.updateData(row.index, column.id, next)}>
                            <SelectTrigger className="h-9 min-w-52"><SelectValue placeholder="Curso" /></SelectTrigger>
                            <SelectContent>
                                {availableCycles.map(ciclo => <SelectItem key={ciclo.id} value={ciclo.nombre}>{ciclo.nombre}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    )
                }
                return editing ? <EditableCell getValue={() => value} row={row} column={column} table={table} /> : <span className="font-medium">{value}</span>
            },
        },
        {
            accessorKey: "periodo",
            header: "Periodo",
            cell: ({ getValue, row, column, table }) => getTableMeta(table)?.editingRowId === row.id
                ? <EditableCell getValue={getValue} row={row} column={column} table={table} className="w-28" />
                : <span>{getValue() as string}</span>,
        },
        {
            accessorKey: "modalidad",
            header: "Modalidad",
            cell: ({ getValue, row, column, table }) => {
                const value = getValue() as CertificadoModalidad
                if (getTableMeta(table)?.editingRowId !== row.id) return <span>{value}</span>
                return (
                    <Select value={value} onValueChange={next => getTableMeta(table)?.updateData(row.index, column.id, next)}>
                        <SelectTrigger className="h-9 w-44"><SelectValue /></SelectTrigger>
                        <SelectContent>{MODALIDADES.map(item => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectContent>
                    </Select>
                )
            },
        },
        {
            accessorKey: "nota",
            header: "Nota",
            cell: ({ getValue, row, column, table }) => getTableMeta(table)?.editingRowId === row.id
                ? <EditableCell getValue={getValue} row={row} column={column} table={table} className="w-20" />
                : <span className="font-semibold">{Number(getValue()) || 0}</span>,
        },
        {
            id: "acciones",
            header: "",
            cell: ({ row, table }) => {
                if (disabled) return null
                const editing = getTableMeta(table)?.editingRowId === row.id
                if (editing) {
                    return (
                        <div className="flex justify-end gap-1">
                            <Button type="button" variant="ghost" size="icon" title="Guardar fila" onClick={() => getTableMeta(table)?.onRowUpdate?.(row.original)}><Save className="h-4 w-4 text-emerald-600" /></Button>
                            <Button type="button" variant="ghost" size="icon" title="Cancelar" onClick={() => row.original.isNew ? getTableMeta(table)?.onRowDelete?.(row.original.id!) : getTableMeta(table)?.setEditingRowId(null)}><X className="h-4 w-4" /></Button>
                        </div>
                    )
                }
                return (
                    <div className="flex justify-end gap-1">
                        <Button type="button" variant="ghost" size="icon" title="Editar fila" onClick={() => handleEdit(row.original)}><Pencil className="h-4 w-4" /></Button>
                        <Button type="button" variant="ghost" size="icon" title="Eliminar fila" onClick={() => getTableMeta(table)?.onRowDelete?.(row.original.id!)}><Trash2 className="h-4 w-4 text-red-600" /></Button>
                    </div>
                )
            },
        },
    ], [availableCycles, curriculaAnterior, disabled, handleEdit])

    return (
        <div className="space-y-2">
            <div>
                <h2 className="text-lg font-semibold">Detalle de notas</h2>
                <p className="text-sm text-muted-foreground">Cursos, periodos, modalidad y calificaciones que apareceran en el certificado.</p>
            </div>
            <DataTableEditable
                columns={columns}
                data={data}
                setData={setData}
                filterColumn="ciclo"
                onRowAdd={disabled ? undefined : handleAdd}
                onRowUpdate={handleUpdate}
                onRowDelete={handleDelete}
                onRowDoubleClick={disabled ? undefined : handleEdit}
                editingRowId={editingRowId}
                setEditingRowId={setEditingRowId}
                highlightUnsavedRows
                pageSize={20}
            />
        </div>
    )
}
