'use client'
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { CheckIcon, XIcon, PencilIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import { DataTableEditable } from "@/components/datatable/data-table-editable";
import { EditableCell } from "@/components/datatable/editable-cell";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Usuario from "@/modules/usuarios/intefaces/usuario.interface";
import UsuariosService from "@/modules/usuarios/services/usuarios.service";
import useUsuarios from "@/modules/estructura/hooks/use-usuarios";
import { ConfirmDeleteDialog } from "@/components/dialogs/confirm-delete-dialog";

interface TableMeta {
    editingRowId: string | null;
    setEditingRowId: (id: string | null) => void;
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
    onRowUpdate?: (newRow: Usuario) => Promise<void>;
    onRowDelete?: (id: number) => Promise<void>;
    setData: React.Dispatch<React.SetStateAction<Usuario[]>>;
}

const columns: ColumnDef<Usuario>[] = [
    {
        accessorKey: "email",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Email" />
        },
        cell: EditableCell,
    },
    {
        accessorKey: "password",
        header: "Password",
        cell: (props) => {
            const { row, table } = props
            const meta = table.options.meta as TableMeta
            const isEditing = meta?.editingRowId === row.id

            if (isEditing) {
                return (
                    <EditableCell {...props} />
                )
            }

            return <span>••••••••</span>
        },
        meta: {
            type: "password"
        }
    },
    {
        accessorKey: "rol",
        header: "Rol",
        cell: (props) => {
            const { getValue, row, column, table } = props
            const initialValue = getValue() as string
            const meta = table.options.meta as TableMeta
            const isEditing = meta?.editingRowId === row.id

            if (isEditing) {
                return (
                    <Select
                        defaultValue={initialValue}
                        onValueChange={(value) => {
                            meta?.updateData(row.index, column.id, value)
                        }}
                    >
                        <SelectTrigger className="h-8 w-[140px]">
                            <SelectValue placeholder="Rol" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ADMIN">ADMIN</SelectItem>
                            <SelectItem value="DOCENTE">DOCENTE</SelectItem>
                            <SelectItem value="ESTUDIANTE">ESTUDIANTE</SelectItem>
                        </SelectContent>
                    </Select>
                )
            }

            return <span>{initialValue}</span>
        },
    },
    {
        id: "actions",
        header: "Acciones",
        cell: ({ row, table }) => {
            const meta = table.options.meta as TableMeta
            const isEditing = meta?.editingRowId === row.id

            const handleEdit = () => {
                meta?.setEditingRowId(row.id)
            }

            const handleSave = async () => {
                const onRowUpdate = meta?.onRowUpdate
                if (onRowUpdate) {
                    await onRowUpdate(row.original)
                }
                meta?.setEditingRowId(null)
            }

            const handleCancel = () => {
                meta?.setEditingRowId(null)
                if (row.original.isNew) {
                    const setData = meta?.setData
                    if (setData) {
                        setData((old: Usuario[]) => old.filter((r) => r.id !== row.original.id))
                    }
                }
            }

            const handleDelete = async () => {
                const onRowDelete = meta?.onRowDelete
                if (onRowDelete) {
                    await onRowDelete(row.original.id as number)
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
]

export default function UsuariosDataTable() {
    const { data, loading, setData } = useUsuarios<Usuario>();
    const [editingRowId, setEditingRowId] = React.useState<string | null>(null)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const [userToDelete, setUserToDelete] = React.useState<Usuario | null>(null);

    const handleRowAdd = () => {
        const id = Math.floor(Math.random() * 1000) + 1000; // Unique temp ID
        const newRow: Usuario = {
            id,
            email: '',
            rol: 'DOCENTE',
            password: 'password123', // Default password for new users
            isNew: true
        };
        setData((old) => [...old, newRow]);
        setEditingRowId(id.toString());
    }

    const handleRowDelete = async (id: number) => {
        const user = data.find(u => u.id === id);
        if (user) {
            setUserToDelete(user);
            setIsDeleteDialogOpen(true);
        }
    }

    const handleConfirmDelete = async () => {
        if (userToDelete) {
            await UsuariosService.deleteItem(userToDelete.id as number);
            setData((old) => old.filter((row) => row.id !== userToDelete.id));
            setIsDeleteDialogOpen(false);
            setUserToDelete(null);
        }
    }

    const handleRowUpdate = async (newRow: Usuario) => {
        if (newRow.isNew) {
            const res = await UsuariosService.newItem(newRow)
            const created = { ...newRow, id: (res as unknown as { id: number }).id, isNew: false }
            setData((old) => old.map((row) => (row.id === newRow.id ? created : row)))
        } else {
            await UsuariosService.updateItem(newRow)
            setData((old) => old.map((row) => (row.id === newRow.id ? newRow : row)))
        }
    }

    return (
        <React.Fragment>
            <React.Suspense fallback={<DataTableSkeleton />}>
                {loading ? (
                    <DataTableSkeleton />
                ) : (
                    <DataTableEditable
                        columns={columns}
                        data={data}
                        setData={setData}
                        filterColumn="email"
                        onRowAdd={handleRowAdd}
                        onRowUpdate={handleRowUpdate}
                        onRowDelete={handleRowDelete}
                        editingRowId={editingRowId}
                        setEditingRowId={setEditingRowId}
                    />
                )}
            </React.Suspense>
            <ConfirmDeleteDialog
                isOpen={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={handleConfirmDelete}
                description={`¿Está seguro que desea eliminar al usuario ${userToDelete?.email}? Esta acción no se puede deshacer.`}
            />
        </React.Fragment>
    )
}