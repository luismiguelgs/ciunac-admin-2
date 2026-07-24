"use client"

import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    Row,
    SortingState,
    VisibilityState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "../ui/input"
import React from "react"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTablePagination } from "./data-table-pagination"
import { DataTableViewOptions } from "./data-table-column-toggle"

function compareTableValues(left: unknown, right: unknown): number {
    if (Object.is(left, right)) return 0
    if (left === null || left === undefined || left === "") return 1
    if (right === null || right === undefined || right === "") return -1

    if (typeof left === "number" && typeof right === "number" && Number.isFinite(left) && Number.isFinite(right)) {
        return left - right
    }

    if (left instanceof Date && right instanceof Date) {
        return left.getTime() - right.getTime()
    }

    return String(left).localeCompare(String(right), "es-PE", {
        numeric: true,
        sensitivity: "base",
    })
}

function localeAwareSorting<TData>(rowA: Row<TData>, rowB: Row<TData>, columnId: string): number {
    return compareTableValues(rowA.getValue(columnId), rowB.getValue(columnId))
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[],
    filterColumn: string
    selectable?: boolean
    pageSize?: number
    compact?: boolean
    searchPlaceholder?: string
    initialColumnVisibility?: VisibilityState
}

export function DataTable<TData, TValue>({
    columns,
    data,
    filterColumn,
    selectable = false,
    pageSize = 10,
    compact = false,
    searchPlaceholder,
    initialColumnVisibility
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(initialColumnVisibility ?? {})
    const [rowSelection, setRowSelection] = React.useState({})
    const table = useReactTable({
        data,
        columns,
        defaultColumn: {
            sortingFn: localeAwareSorting,
        },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
        initialState: {
            pagination: {
                pageSize: pageSize,
            },
        },
    })

    return (
        <>
            <div className="flex items-center py-4">
                <Input
                    placeholder={searchPlaceholder ?? "Buscar..."}
                    value={(table.getColumn(filterColumn)?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn(filterColumn)?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <DataTableViewOptions table={table} />
            </div>
            <div className="overflow-hidden rounded-md border">
                <Table className={compact ? "text-[13px]" : undefined}>
                    <TableHeader className="bg-black hover:bg-black">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="hover:bg-black border-b-gray-800">
                                {headerGroup.headers.map((header) => {
                                    const columnHeader = header.column.columnDef.header

                                    return (
                                        <TableHead
                                            key={header.id}
                                            className={`text-white font-semibold${compact ? " h-9 py-1" : ""}`}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : typeof columnHeader === "string" && header.column.getCanSort()
                                                    ? <DataTableColumnHeader column={header.column} title={columnHeader} />
                                                    : flexRender(columnHeader, header.getContext())}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className={compact ? "py-1.5" : undefined}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={table.getVisibleLeafColumns().length} className="h-24 text-center">
                                    {/*No hay resultados.*/}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} selectable={selectable} />
        </>
    )
}
