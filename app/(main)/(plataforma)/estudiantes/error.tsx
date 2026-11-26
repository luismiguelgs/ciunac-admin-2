"use client"

import NavigationBread from "@/components/navigation-bread"
import BackButton from "@/components/back.button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function StudentError({ reset }: { reset: () => void }) {
    const router = useRouter()
    return (
        <>
            <NavigationBread section="Plataforma" href="/dashboard" page="Estudiantes" />
            <div className="container mx-auto space-y-3 px-2 py-2">
                <Alert variant="destructive">
                    <AlertTitle>No se pudo cargar la página</AlertTitle>
                    <AlertDescription>Revise la conexión con CIUNAC y vuelva a consultar.</AlertDescription>
                </Alert>
                <div className="flex flex-wrap gap-2">
                    <BackButton href="/estudiantes" />
                    <Button onClick={() => { router.refresh(); reset() }}>Volver a consultar</Button>
                </div>
            </div>
        </>
    )
}
