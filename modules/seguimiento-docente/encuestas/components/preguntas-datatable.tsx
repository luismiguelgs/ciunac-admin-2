'use client'
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { CheckIcon, XIcon, PencilIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import { DataTableEditable } from "@/components/datatable/data-table-editable";
import { EditableCell } from "@/components/datatable/editable-cell";
import { Switch } from "@/components/ui/switch";

import { IPregunta } from "../interfaces/preguntas.interface";
import PreguntasService from "../services/preguntas.service";
import { toast } from "sonner";

export function PreguntasDataTable() {
    const [data, setData] = React.useState<IPregunta[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [editingRowId, setEditingRowId] = React.useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await PreguntasService.fetchItems<IPregunta>();
            setData(res);
        } catch (error) {
            console.error("Error fetching preguntas:", error);
            toast.error("Error al cargar las preguntas");
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchData();
    }, []);

    const columns: ColumnDef<IPregunta>[] = React.useMemo(() => [
        {
            accessorKey: "orden",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Orden" />,
            cell: (props) => <EditableCell {...props} />,
        },
        {
            accessorKey: "textoPregunta",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Pregunta" />,
            cell: EditableCell,
        },
        {
            accessorKey: "dimension",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Dimensión" />,
            cell: EditableCell,
        },
        {
            accessorKey: "activo",
            header: "Activo",
            cell: (props) => {
                const { getValue, row, column, table } = props
                const initialValue = getValue() as boolean
                const meta = table.options.meta as any
                const isEditing = meta?.editingRowId === row.id

                if (isEditing) {
                    return (
                        <Switch
                            checked={initialValue}
                            onCheckedChange={(checked) => {
                                meta?.updateData(row.index, column.id, checked)
                            }}
                        />
                    )
                }

                return (
                    <div className={`w-3 h-3 rounded-full ${initialValue ? 'bg-green-500' : 'bg-red-500'}`} title={initialValue ? "Activo" : "Inactivo"} />
                )
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
    ], []);

    const handleRowAdd = () => {
        const id = Math.floor(Math.random() * 9000) + 1000;
        const newRow: IPregunta = {
            id,
            orden: data.length + 1,
            textoPregunta: '',
            dimension: '',
            activo: true,
            isNew: true
        };
        setData((old) => [...old, newRow]);
        setEditingRowId(id.toString());
    }

    const handleRowDelete = async (id: number) => {
        if (confirm("¿Confirma borrar el registro?")) {
            try {
                await PreguntasService.deleteItem(id);
                setData((old) => old.filter((row) => row.id !== id));
                toast.success("Pregunta eliminada");
            } catch (error) {
                toast.error("Error al eliminar la pregunta");
            }
        }
    }

    const handleRowUpdate = async (newRow: IPregunta) => {
        try {
            if (newRow.isNew) {
                const { isNew, id, ...payload } = newRow;
                const res = await PreguntasService.newItem<IPregunta>(payload);
                setData((old) => old.map((row) => (row.id === id ? { ...res, isNew: false } : row)));
                toast.success("Pregunta creada");
            } else {
                const { isNew, ...payload } = newRow;
                await PreguntasService.updateItem<IPregunta>(payload as any);
                setData((old) => old.map((row) => (row.id === newRow.id ? newRow : row)));
                toast.success("Pregunta actualizada");
            }
        } catch (error) {
            toast.error("Error al guardar la pregunta");
        }
    }

    return (
        <div className="container mx-auto py-2">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Listado de Preguntas</h2>
            </div>
            <React.Suspense fallback={<DataTableSkeleton />}>
                {loading ? (
                    <DataTableSkeleton />
                ) : (
                    <DataTableEditable
                        columns={columns}
                        data={data}
                        setData={setData}
                        filterColumn="textoPregunta"
                        onRowAdd={handleRowAdd}
                        onRowUpdate={handleRowUpdate}
                        onRowDelete={handleRowDelete}
                        editingRowId={editingRowId}
                        setEditingRowId={setEditingRowId}
                    />
                )}
            </React.Suspense>
        </div>
    )
}
