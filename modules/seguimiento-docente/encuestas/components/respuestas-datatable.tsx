'use client'
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header";
import { DataTable } from "@/components/datatable/data-table";
import { IEncuestaRespuesta } from "../interfaces/respuestas.interface";
import { IEncuestaMetricas } from "../interfaces/encuesta-metricas.interface";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { UserIcon, CalendarIcon, BarChart3Icon, UsersIcon, BookOpenIcon } from "lucide-react";
import BackButton from "@/components/back.button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface RespuestasDataTableProps {
    data: IEncuestaRespuesta[];
    metricas: IEncuestaMetricas;
}

export function RespuestasDataTable({ data, metricas }: RespuestasDataTableProps) {
    const columns: ColumnDef<IEncuestaRespuesta>[] = React.useMemo(() => [
        {
            accessorKey: "grupo",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Grupo" />,
        },
        {
            accessorKey: "promedioIndividual",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Promedio" />,
            cell: ({ getValue }) => {
                const value = getValue() as string;
                return <div className="text-center font-bold">{value}</div>
            }
        },
        {
            accessorKey: "comentario",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Comentario" />,
            cell: ({ getValue }) => {
                const comentario = getValue() as string;
                if (!comentario || comentario === "-") {
                    return <span className="text-muted-foreground">-</span>;
                }
                return (
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="ghost"
                                className="h-auto p-0 hover:bg-transparent font-normal justify-start text-left w-full"
                            >
                                <div className="max-w-[300px] truncate cursor-pointer hover:text-primary transition-colors">
                                    {comentario}
                                </div>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-96 max-h-60 overflow-y-auto">
                            <div className="space-y-2">
                                <h4 className="font-semibold text-sm">Comentario completo</h4>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                    {comentario}
                                </p>
                            </div>
                        </PopoverContent>
                    </Popover>
                );
            }
        },
        {
            accessorKey: "fechaRegistro",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Fecha" />,
            cell: ({ getValue }) => {
                const value = getValue() as string;
                if (!value) return "-";
                try {
                    return format(new Date(value), "dd/MM/yyyy HH:mm", { locale: es });
                } catch (e) {
                    return value;
                }
            }
        },
    ], []);

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="overflow-hidden border-l-4 border-l-primary">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="bg-primary/10 p-2 rounded-full">
                            <UserIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Docente</p>
                            <p className="text-sm font-bold">{metricas.docente.nombres} {metricas.docente.apellidos}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden border-l-4 border-l-blue-500">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="bg-blue-500/10 p-2 rounded-full">
                            <CalendarIcon className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Periodo</p>
                            <p className="text-sm font-bold">{metricas.modulo.nombre}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden border-l-4 border-l-green-500">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="bg-green-500/10 p-2 rounded-full">
                            <BarChart3Icon className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Promedio Gral.</p>
                            <p className="text-sm font-bold">{Number(metricas.promedioGeneral).toFixed(2)}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden border-l-4 border-l-purple-500">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="bg-purple-500/10 p-2 rounded-full flex gap-1">
                            <UsersIcon className="h-5 w-5 text-purple-500" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Totales</p>
                            <div className="flex gap-3 mt-0.5">
                                <div className="flex items-center gap-1">
                                    <UsersIcon className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-sm font-bold">{metricas.totalEncuestados}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <BookOpenIcon className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-sm font-bold">{metricas.totalCursos}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold tracking-tight">Detalle de Respuestas</h2>
                    <BackButton href="/perfil-docente/encuestas" />
                </div>
                <DataTable
                    columns={columns}
                    data={data}
                    filterColumn="grupo"
                    pageSize={20}
                />
            </div>
        </div>
    )
}
