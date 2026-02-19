'use client'
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import { DataTable } from "@/components/datatable/data-table";
import { IPerfilResultado } from "./perfil-resultado.interface";
import PerfilResultadoService from "./prefil-resultado.service";
import { EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { toast } from "sonner";
import { SelectPeriodo } from "@/components/select-periodo";
import useOpciones from "../../estructura/hooks/use-opciones";
import { IIdioma } from "../../estructura/interfaces/types.interface";
import { Collection } from "../../estructura/services/opciones.service";

export function RankingDataTable() {
    const [data, setData] = React.useState<IPerfilResultado[]>([]);
    const [selectedModuloId, setSelectedModuloId] = React.useState<string>("");
    const [loading, setLoading] = React.useState(true);
    const { data: idiomas } = useOpciones<IIdioma>(Collection.Idiomas);

    const fetchData = async (moduloId: string) => {
        if (!moduloId) return;
        try {
            setLoading(true);
            const res = await PerfilResultadoService.getItemsByModulo(moduloId);
            setData(res);
        } catch (error) {
            console.error("Error fetching ranking:", error);
            toast.error("Error al cargar el ranking");
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        if (selectedModuloId) {
            fetchData(selectedModuloId);
        }
    }, [selectedModuloId]);

    const columns: ColumnDef<IPerfilResultado>[] = React.useMemo(() => [
        {
            id: "docente",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Docente" />,
            accessorFn: (row) => `${row.docente?.nombres} ${row.docente?.apellidos}`,
            cell: ({ row }) => {
                return <span className="font-medium">{row.original.docente?.nombres} {row.original.docente?.apellidos}</span>
            }
        },
        {
            accessorKey: "resultadoFinal",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Total" />,
            cell: ({ getValue }) => {
                const value = getValue();
                const numValue = Number(value);
                return <div className="text-center font-bold text-lg">{!isNaN(numValue) && value !== null ? numValue.toFixed(2) : '0.00'}</div>
            }
        },
        {
            id: "puntajePerfil",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Perfil" />,
            accessorFn: (row) => row.perfilDocente?.puntajeFinal,
            cell: ({ getValue }) => {
                const value = getValue();
                const numValue = Number(value);
                return <div className="text-center">{!isNaN(numValue) && value !== null ? numValue.toFixed(2) : '0.00'}</div>
            }
        },
        {
            id: "experiencia",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Exp. (años)" />,
            accessorFn: (row) => row.perfilDocente?.experienciaTotal,
            cell: ({ getValue }) => <div className="text-center">{getValue() as number}</div>
        },
        {
            id: "idioma",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Idioma" />,
            accessorFn: (row) => {
                const idiomaId = row.perfilDocente?.idiomaId;
                const idioma = idiomas.find(i => i.id === idiomaId);
                return idioma?.nombre || '-';
            },
            cell: ({ getValue }) => <div className="text-center">{getValue() as string}</div>
        },
        {
            id: "nivel",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Nivel" />,
            accessorFn: (row) => row.perfilDocente?.nivelIdioma,
            cell: ({ getValue }) => <div className="text-center text-xs">{getValue() as string || '-'}</div>
        },
        {
            id: "actions",
            header: "Acciones",
            cell: ({ row }) => {
                return (
                    <div className="flex justify-center">
                        <Button variant="ghost" size="icon" asChild title="Ver detalles">
                            <Link href={`/perfil-docente/${row.original.perfilDocenteId}`}>
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
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-end gap-4">
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
