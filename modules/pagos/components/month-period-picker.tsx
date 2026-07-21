"use client"

import { CalendarDays } from "lucide-react"
import { Input } from "@/components/ui/input"

interface MonthPeriodPickerProps {
    value: string
    onValueChange: (value: string) => void
    disabled?: boolean
}

export function MonthPeriodPicker({ value, onValueChange, disabled = false }: MonthPeriodPickerProps) {
    return (
        <div className="w-full space-y-2 sm:w-56">
            <label htmlFor="bank-payment-period" className="text-sm font-medium">
                Periodo
            </label>
            <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    id="bank-payment-period"
                    type="month"
                    value={value}
                    onChange={(event) => onValueChange(event.target.value)}
                    disabled={disabled}
                    className="pl-9"
                    aria-label="Periodo mensual de pagos"
                />
            </div>
        </div>
    )
}
