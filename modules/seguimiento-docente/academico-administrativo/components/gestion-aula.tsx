'use client'

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import { SelectPeriodo } from "@/components/select-periodo";
import { toast } from "sonner";
import { ICumplimientoDocente } from "../cumplimiento.interface";
import CumplimientoService from "../cumplimiento.service";
import { DataTableEditable } from "@/components/datatable/data-table-editable";
import { CheckIcon, XIcon, PencilIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
    ComboboxTrigger,
    ComboboxValue,
} from "@/components/ui/combobox"
import { ChevronDown } from "lucide-react";
import DocentesService from "../../docentes/docente.service";
import { IDocente } from "../../docentes/docente.interface";
import { PerfilOpcionesService, Collection } from "../../opciones/perfil-opciones.service";
import { IPuntajesAcademicoAdmin } from "../../opciones/perfil-types.interface";

const ACADEMICO_ADMINISTRATIVO_ID = 4;

export default function GestionAula() {
    const [data, setData] = React.useState<ICumplimientoDocente[]>([]);
    const [selectedModuloId, setSelectedModuloId] = React.useState<string>("");
    const [loading, setLoading] = React.useState(true);
    const [editingRowId, setEditingRowId] = React.useState<string | null>(null);
    const [docentes, setDocentes] = React.useState<IDocente[]>([]);
    const [puntajeOptions, setPuntajeOptions] = React.useState<IPuntajesAcademicoAdmin[]>([]);

    const fetchData = async (moduloId: string) => {
        if (!moduloId) return;
        try {
            setLoading(true);
            const res = await CumplimientoService.getItemsAcadAdminPeriodo(moduloId, ACADEMICO_ADMINISTRATIVO_ID);
            setData(res);
        } catch (error) {
            console.error("Error fetching cumplimiento data:", error);
            toast.error("Error al cargar los datos de cumplimiento");
        } finally {
            setLoading(false);
        }
    };

    const fetchDocentes = async () => {
        try {
            const res = await DocentesService.fetchItems();
            setDocentes(res.filter((d) => d.activo));
        } catch (error) {
            console.error("Error fetching docentes:", error);
        }
    };

    const fetchPuntajes = async () => {
        try {
            const res = await PerfilOpcionesService.fetchItems<IPuntajesAcademicoAdmin>(Collection.PuntajesAcademicoAdmin);
            const filtered = res.filter(p => p.academicoAdministrativoId === ACADEMICO_ADMINISTRATIVO_ID);
            setPuntajeOptions(filtered);
        } catch (error) {
            console.error("Error fetching puntajes:", error);
        }
    };

    React.useEffect(() => {
        fetchDocentes();
        fetchPuntajes();
    }, []);

    React.useEffect(() => {
        if (selectedModuloId) {
            fetchData(selectedModuloId);
        }
    }, [selectedModuloId]);

    const columns: ColumnDef<ICumplimientoDocente>[] = React.useMemo(() => [
        {
            id: "docente",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Docente" />,
            accessorFn: (row) => `${row.docente?.nombres} ${row.docente?.apellidos}`,
            cell: (props) => {
                const { row, table } = props
                const meta = table.options.meta as any
                const isEditing = meta?.editingRowId === row.id

                const options = docentes.map(d => ({ label: `${d.nombres} ${d.apellidos}`, value: d.id }));
                const selectedOption = options.find(opt => opt.value === row.original.docenteId) ?? null;

                if (isEditing) {
                    return (
                        <Combobox
                            items={options}
                            value={selectedOption}
                            onValueChange={(val) => {
                                meta?.updateData(row.index, "docenteId", val?.value)
                            }}
                        >
                            <ComboboxTrigger
                                id={`combo-docente-${row.id}`}
                                render={
                                    <Button variant="outline" className="h-8 w-[300px] justify-between font-normal">
                                        <ComboboxValue placeholder="Seleccionar docente..." />
                                        <ChevronDown className="h-4 w-4 opacity-50" />
                                    </Button>
                                }
                            />
                            <ComboboxContent>
                                <ComboboxInput showTrigger={false} placeholder="Buscar docente..." />
                                <ComboboxEmpty>No se encontraron docentes.</ComboboxEmpty>
                                <ComboboxList>
                                    {(item) => (
                                        <ComboboxItem key={item.value} value={item}>
                                            {item.label}
                                        </ComboboxItem>
                                    )}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                    )
                }
                return <span className="font-medium">{row.original.docente?.nombres} {row.original.docente?.apellidos}</span>
            }
        },
        {
            accessorKey: "puntaje",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Puntaje" />,
            cell: (props) => {
                const { row, table } = props
                const meta = table.options.meta as any
                const isEditing = meta?.editingRowId === row.id

                if (isEditing) {
                    return (
                        <Select
                            defaultValue={row.original.puntaje?.toString()}
                            onValueChange={(value) => {
                                meta?.updateData(row.index, "puntaje", parseInt(value))
                            }}
                        >
                            <SelectTrigger className="h-8 w-[200px]">
                                <SelectValue placeholder="Puntaje" />
                            </SelectTrigger>
                            <SelectContent>
                                {puntajeOptions.map((option) => (
                                    <SelectItem key={option.id} value={option.puntaje.toString()}>
                                        {option.nombre}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )
                }
                return <div className="text-center font-bold">{row.original.puntaje}</div>
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
                    </div>
                )
            },
        },
    ], [docentes, puntajeOptions]);

    const handleRowUpdate = async (newRow: ICumplimientoDocente) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { docente, modulo, academicoAdministrativo, ...sanitizedRow } = newRow as any;

            const findDocente = docentes.find(d => d.id === newRow.docenteId);
            const updatedRow = { ...newRow, docente: findDocente } as any;

            if ((newRow as any).isNew) {
                const res = await CumplimientoService.newItemOmit<ICumplimientoDocente>(sanitizedRow)
                const created = { ...updatedRow, id: (res as any).id, isNew: false }
                setData((old) => old.map((row) => (row.id === newRow.id ? created : row)))
                toast.success("Registro creado correctamente")
            } else {
                await CumplimientoService.updateItemOmit<ICumplimientoDocente>(sanitizedRow as any)
                setData((old) => old.map((row) => (row.id === newRow.id ? updatedRow : row)))
                toast.success("Registro actualizado correctamente")
            }
        } catch (error) {
            console.error("Error updating row:", error);
            toast.error("Error al guardar el registro");
        }
    };

    const handleRowDelete = async (id: any) => {
        // Not implemented
    };

    const handleRowAdd = () => {
        if (!selectedModuloId) {
            toast.warning("Seleccione un periodo primero")
            return
        }
        const id = (Math.floor(Math.random() * 90000) + 10000).toString();
        const newRow: any = {
            id,
            moduloId: parseInt(selectedModuloId),
            academicoAdministrativoId: ACADEMICO_ADMINISTRATIVO_ID,
            docenteId: '',
            puntaje: 0,
            isNew: true
        };
        setData((old) => [...old, newRow]);
        setEditingRowId(id);
    }

    return (
        <div className="container mx-auto py-2">
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-xl font-bold tracking-tight">Gestión de Aula y Metodología</h2>
                <div className="flex items-center gap-2">
                    <SelectPeriodo
                        onValueChange={setSelectedModuloId}
                        value={selectedModuloId}
                        label=""
                        triggerClassName="w-[180px]"
                    />
                </div>
            </div>

            <React.Suspense fallback={<DataTableSkeleton />}>
                {loading ? (
                    <DataTableSkeleton />
                ) : (
                    <DataTableEditable
                        columns={columns}
                        data={data}
                        setData={setData}
                        filterColumn="docente"
                        editingRowId={editingRowId}
                        setEditingRowId={setEditingRowId}
                        onRowUpdate={handleRowUpdate}
                        onRowDelete={handleRowDelete}
                        onRowAdd={handleRowAdd}
                    />
                )}
            </React.Suspense>
        </div>
    )
}