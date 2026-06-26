import React, { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export const EditableCell = ({
    getValue,
    row,
    column,
    table,
    className,
}: any) => {
    const initialValue = getValue()
    const [value, setValue] = useState(initialValue)

    const onBlur = () => {
        table.options.meta?.updateData(row.index, column.id, value)
    }

    useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    const isEditing = table.options.meta?.editingRowId === row.id
    const columnType = column.columnDef.meta?.type || "text"
    const formatDateValue = (dateValue: unknown) => {
        if (dateValue instanceof Date) return dateValue.toISOString().split("T")[0]
        if (typeof dateValue === "string") return dateValue.split("T")[0]
        return dateValue
    }

    const inputValue = columnType === "date" ? formatDateValue(value) : value
    const displayValue = columnType === "date" ? formatDateValue(value) : value instanceof Date ? value.toLocaleDateString() : value

    if (isEditing) {
        return (
            <Input
                type={columnType}
                value={inputValue as string}
                onChange={(e) => setValue(e.target.value)}
                onBlur={onBlur}
                className={cn("h-8", className)}
            />
        )
    }

    return <span>{displayValue}</span>
}
