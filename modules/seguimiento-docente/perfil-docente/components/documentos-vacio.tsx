'use client'

import { Button } from "@/components/ui/button"
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"

import { FolderInputIcon } from "lucide-react"


interface DocumentosVacioProps {
    onNuevo?: () => void
}

export default function DocumentosVacio({ onNuevo }: DocumentosVacioProps) {
    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <FolderInputIcon />
                </EmptyMedia>
                <EmptyTitle>No hay documentos disponibles</EmptyTitle>
                <EmptyDescription>
                    No hay documentos disponibles. Precede a crear la documentación.
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent className="flex-row justify-center gap-2">
                <Button onClick={onNuevo}>Crear Documento</Button>
            </EmptyContent>
        </Empty>
    )
}