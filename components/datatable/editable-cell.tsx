import React, { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"

interface EditableCellProps {
    value: any
    row: any
    column: any
    table: any
}

export const EditableCell = ({
    getValue,
    row,
    column,
    table,
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

    const displayValue = value instanceof Date ? value.toLocaleDateString() : value

    if (isEditing) {
        return (
            <Input
                value={value instanceof Date ? value.toISOString().split('T')[0] : (value as string)}
                onChange={(e) => setValue(e.target.value)}
                onBlur={onBlur}
                className="h-8"
            />
        )
    }

    return <span>{displayValue}</span>
}
