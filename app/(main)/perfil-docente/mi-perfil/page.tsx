import React from "react";
import { auth } from "@/auth";
import PerfilDocenteService from "@/modules/seguimiento-docente/perfil-docente/services/perfil-docente.service";
import PerfilDocenteForm from "@/modules/seguimiento-docente/perfil-docente/forms/perfil-docente.form";
import DocumentosPerfil from "@/modules/seguimiento-docente/perfil-docente/components/documentos-perfil";
import DocumentosDocenteService from "@/modules/seguimiento-docente/perfil-docente/services/documentos-docente.service";
import { PerfilDocente } from "@/modules/seguimiento-docente/perfil-docente/interfaces/perfil-docente.interface";
import IDocumentosPerfil from "@/modules/seguimiento-docente/perfil-docente/interfaces/documentos-perfil.interface"
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";

import { ROLES } from "@/lib/roles";

export default async function MiPerfilPage() {
    const session = await auth();
    const sessionUser = session?.user;
    
    // Extraer IDs del contexto (sesión extendida en auth.ts)
    const perfilId = sessionUser?.perfilId;
    const docenteId = sessionUser?.docenteId;
    const userRole = sessionUser?.rol;

    let perfil: PerfilDocente | undefined = undefined;
    let documentos: IDocumentosPerfil[] = [];

    if (perfilId) {
        try {
            perfil = await PerfilDocenteService.getItem(perfilId);
            documentos = await DocumentosDocenteService.getDocuments(perfilId);
        } catch (error) {
            console.error("Error loading profile data:", error);
        }
    } else if (docenteId) {
        // Estructura mínima para creación si el perfil aún no existe
        perfil = {
            docenteId: String(docenteId),
            experienciaTotal: 0,
            idiomaId: 0,
            puntajeFinal: 0,
            visible: true
        } as PerfilDocente;
    }

    if (!docenteId && !perfilId) {
        return (
            <div className="p-6">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error de Acceso</AlertTitle>
                    <AlertDescription>
                        No se pudo identificar tu cuenta de docente. Por favor, contacta al administrador.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    // El docente no debe poder editar su propio perfil una vez creado, pero otros (admin) sí.
    const isEditable = userRole !== ROLES.DOCENTE;

    return (
        <div className="container mx-auto p-4 md:p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Mi Perfil Profesional</h1>
                <p className="text-muted-foreground mt-1 text-lg">
                    Gestiona tu información docente y documentos obligatorios.
                </p>
            </div>
            
            <div className="space-y-8">
                <PerfilDocenteForm perfil={perfil} editable={isEditable} />
                
                {perfilId ? (
                    <DocumentosPerfil documentos={documentos} perfilId={perfilId} editable={isEditable} />
                ) : (
                    <CardNoDocuments />
                )}
            </div>
        </div>
    );
}

function CardNoDocuments() {
    return (
        <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center text-center py-12 bg-muted/20">
                <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">Documentos no disponibles</h3>
                <p className="text-muted-foreground max-w-sm mt-2">
                    Primero debes completar y guardar tu perfil profesional para poder gestionar tus documentos.
                </p>
            </CardContent>
        </Card>
    );
}
