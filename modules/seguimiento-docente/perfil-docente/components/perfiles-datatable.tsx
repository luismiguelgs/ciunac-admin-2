'use client'
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import { DataTable } from "@/components/datatable/data-table";
import { PerfilDocente } from "../interfaces/perfil-docente.interface";
import PerfilDocenteService from "../services/perfil-docente.service";
import { EyeIcon, TrashIcon, CircleCheckIcon, BanIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { ConfirmDeleteDialog } from "@/components/dialogs/confirm-delete-dialog";

export function PerfilesDataTable() {
    const [data, setData] = React.useState<PerfilDocente[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [idToDelete, setIdToDelete] = React.useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await PerfilDocenteService.fetchItems<PerfilDocente>();
            setData(res);
        } catch (error) {
            console.error("Error fetching profiles:", error);
            toast.error("Error al cargar los perfiles de docentes");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (id: string) => {
        setIdToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!idToDelete) return;
        try {
            await PerfilDocenteService.deleteItem(idToDelete as any);
            setData(prev => prev.filter(p => p.id !== idToDelete));
            toast.success("Perfil eliminado correctamente");
        } catch (error) {
            console.error("Error deleting profile:", error);
            toast.error("Error al eliminar el perfil");
        } finally {
            setDeleteDialogOpen(false);
            setIdToDelete(null);
        }
    };

    React.useEffect(() => {
        fetchData();
    }, []);

    const columns: ColumnDef<PerfilDocente>[] = React.useMemo(() => [
        {
            id: "docente",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Docente" />,
            accessorFn: (row) => `${row.docente?.nombres} ${row.docente?.apellidos}`,
            cell: ({ row }) => {
                return <span className="font-medium">{row.original.docente?.nombres} {row.original.docente?.apellidos}</span>
            }
        },
        {
            accessorKey: "puntajeFinal",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Puntaje" />,
            cell: ({ getValue }) => {
                const value = getValue();
                const numValue = Number(value);
                return <div className="text-center font-bold">{!isNaN(numValue) && value !== null ? numValue.toFixed(2) : '0.00'}</div>
            }
        },
        {
            accessorKey: "experienciaTotal",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Exp. (años)" />,
            cell: ({ getValue }) => <div className="text-center">{((getValue() as number || 0) / 12).toFixed(2)}</div>
        },
        {
            id: "idioma",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Idioma" />,
            accessorFn: (row) => row.idioma?.nombre,
            cell: ({ getValue }) => <div className="text-center">{getValue() as string}</div>
        },
        {
            accessorKey: "nivelIdioma",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Nivel" />,
            cell: ({ getValue }) => <div className="text-center text-xs">{getValue() as string || '-'}</div>
        },
        {
            accessorKey: "visible",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Visible" />,
            cell: ({ row }) => {
                const isVisible = row.original.visible;
                return (
                    <div className="flex justify-center">
                        {isVisible ? (
                            <CircleCheckIcon className="h-4 w-4 text-green-600" />
                        ) : (
                            <BanIcon className="h-4 w-4 text-red-600" />
                        )}
                    </div>
                );
            }
        },
        {
            id: "actions",
            header: "Acciones",
            cell: ({ row }) => {
                return (
                    <div className="flex justify-center gap-1">
                        <Button variant="ghost" size="icon" asChild title="Ver detalles">
                            <Link href={`/perfil-docente/${row.original.id}`}>
                                <EyeIcon className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(row.original.id!)}
                            title="Eliminar perfil"
                        >
                            <TrashIcon className="h-4 w-4 text-red-600" />
                        </Button>
                    </div>
                )
            }
        }
    ], []);

    return (
        <div className="container mx-auto py-2">
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

            <ConfirmDeleteDialog
                isOpen={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleDeleteConfirm}
                title="¿Eliminar Perfil Docente?"
                description="Esta acción eliminará permanentemente el perfil del docente. ¿Desea continuar?"
            />
        </div>
    )
}
