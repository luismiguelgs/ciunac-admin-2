'use client'
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import { DataTable } from "@/components/datatable/data-table";
import { IEncuestaMetricas } from "../interfaces/encuesta-metricas.interface";
import EncuestaService from "../services/encuesta.service";
import { EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { toast } from "sonner";
import { SelectPeriodo } from "@/components/select-periodo";

export function MetricasDataTable() {
    const [data, setData] = React.useState<IEncuestaMetricas[]>([]);
    const [selectedModuloId, setSelectedModuloId] = React.useState<string>("");
    const [loading, setLoading] = React.useState(true);

    const fetchData = async (moduloId: string) => {
        if (!moduloId) return;
        try {
            setLoading(true);
            const res = await EncuestaService.getItemsByModulo(moduloId);
            setData(res);
        } catch (error) {
            console.error("Error fetching metricas:", error);
            toast.error("Error al cargar las métricas");
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        if (selectedModuloId) {
            fetchData(selectedModuloId);
        }
    }, [selectedModuloId]);

    const columns: ColumnDef<IEncuestaMetricas>[] = React.useMemo(() => [
        {
            id: "docente",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Docente" />,
            accessorFn: (row) => `${row.docente.nombres} ${row.docente.apellidos}`,
            cell: ({ row }) => {
                return <span className="font-medium">{row.original.docente.nombres} {row.original.docente.apellidos}</span>
            }
        },
        {
            accessorKey: "promedioGeneral",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Promedio Gral." />,
            cell: ({ getValue }) => {
                const value = getValue();
                const numValue = Number(value);
                return <div className="text-center font-bold">{!isNaN(numValue) && value !== null ? numValue.toFixed(2) : '0.00'}</div>
            }
        },
        {
            accessorKey: "totalEncuestados",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Encuestados" />,
            cell: ({ getValue }) => <div className="text-center">{getValue() as number}</div>
        },
        {
            accessorKey: "totalCursos",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Cursos" />,
            cell: ({ getValue }) => <div className="text-center">{getValue() as number}</div>
        },
        {
            id: "modulo",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Módulo" />,
            accessorFn: (row) => row.modulo.nombre,
        },
        {
            id: "actions",
            header: "Acciones",
            cell: ({ row }) => {
                return (
                    <div className="flex justify-center">
                        <Button variant="ghost" size="icon" asChild title="Ver detalles">
                            <Link href={`/perfil-docente/encuestas/${row.original.id}`}>
                                <EyeIcon className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                )
            }
        }
    ], []);

    return (
        <div className="container mx-auto py-2">
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-xl font-bold tracking-tight">Métricas Encuesta Docente</h2>
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
                    <DataTable
                        columns={columns}
                        data={data}
                        filterColumn="docente"
                    />
                )}
            </React.Suspense>
        </div>
    )
}