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

export default function DocumentacionPagos() {
    const [data, setData] = React.useState<ICumplimientoDocente[]>([]);
    const [selectedModuloId, setSelectedModuloId] = React.useState<string>("");
    const [loading, setLoading] = React.useState(true);
    const [editingRowId, setEditingRowId] = React.useState<string | null>(null);

    const fetchData = async (moduloId: string) => {
        if (!moduloId) return;
        try {
            setLoading(true);
            // academicoAdministrativoId = 1 for this specific component as requested
            const res = await CumplimientoService.getItemsAcadAdminPeriodo(moduloId, "1");
            setData(res);
        } catch (error) {
            console.error("Error fetching cumplimiento data:", error);
            toast.error("Error al cargar los datos de cumplimiento");
        } finally {
            setLoading(false);
        }
    };

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
            cell: ({ row }) => {
                return <span className="font-medium">{row.original.docente?.nombres} {row.original.docente?.apellidos}</span>
            }
        },
        {
            accessorKey: "puntaje",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Puntaje" />,
            cell: ({ getValue }) => <div className="text-center font-bold">{getValue() as number}</div>
        },
        // Placeholder for actions if needed later
        /*
        {
            id: "actions",
            header: "Acciones",
            cell: ({ row }) => {
                return (
                   <div>...</div>
                )
            }
        }
        */
    ], []);

    // Placeholder handlers for editable table requirements
    const handleRowUpdate = async (newRow: ICumplimientoDocente) => {
        console.log("Update row", newRow);
        // Implement update logic here
    };

    const handleRowDelete = async (id: any) => {
        console.log("Delete row", id);
        // Implement delete logic here
    };

    const handleRowAdd = () => {
        console.log("Add row");
        // Implement add logic here
    }


    return (
        <div className="container mx-auto py-2">
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-xl font-bold tracking-tight">Documentación de Pagos</h2>
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