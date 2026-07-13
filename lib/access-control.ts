export type PermissionCode = string;

export type RoutePermissionRule = {
    path: string;
    permission: PermissionCode;
};

export const ROUTE_PERMISSION_RULES: RoutePermissionRule[] = [
    { path: "/solicitudes/becas", permission: "gestion_becas" },
    { path: "/solicitudes/nueva", permission: "gestion_solicitudes" },
    { path: "/usuarios", permission: "gestionar_usuarios" },
    { path: "/estructura", permission: "gestionar_estructura" },
    { path: "/grupos", permission: "gestionar_estructura" },
    { path: "/perfil-docente/opciones", permission: "puntaje_academico_administrativo" },
    { path: "/perfil-docente/encuestas/importar", permission: "encuesta_preguntas" },
    { path: "/perfil-docente/encuestas/preguntas", permission: "encuesta_preguntas" },
    { path: "/perfil-docente/encuestas", permission: "encuesta_respuestas" },
    { path: "/encuestas/importar", permission: "encuesta_preguntas" },
    { path: "/encuestas/preguntas", permission: "encuesta_preguntas" },
    { path: "/encuestas", permission: "encuesta_respuestas" },
    { path: "/perfil-docente/ranking-docentes", permission: "perfil_docente_resultados" },
    { path: "/perfil-docente/documentos", permission: "perfil_docente" },
    { path: "/perfil-docente/academico-administrativo", permission: "cumplimiento_docente" },
    { path: "/perfil-docente/docentes", permission: "gestion_docentes" },
    { path: "/perfil-docente", permission: "dashboard_docente" },
    { path: "/perfil-docente/mis-resultados", permission: "mi_perfil_docente_resultados" },
    { path: "/perfil-docente/encuestas/mi-encuesta", permission: "mi_encuesta_respuestas" },
    { path: "/perfil-docente/mi-perfil", permission: "mi_perfil_docente" },
    { path: "/solicitudes/constancias", permission: "gestion_solicitudes" },
    { path: "/solicitudes/constancias/[id]", permission: "gestion_solicitudes" },
    { path: "/solicitudes/certificados", permission: "gestion_solicitudes" },
    { path: "/solicitudes/certificados/[id]", permission: "gestion_solicitudes" },
    { path: "/solicitudes/ubicacion", permission: "gestion_solicitudes" },
    { path: "/solicitudes/ubicacion/[id]", permission: "gestion_solicitudes" },
    { path: "/solicitudes/importar-pagos", permission: "importar_pagos" },
    { path: "/examen-ubicacion", permission: "examenes_ubicacion" },
    { path: "/examen-ubicacion/[id]", permission: "examenes_ubicacion" },
    { path: "/examen-ubicacion/nuevo", permission: "examenes_ubicacion" },
    { path: "/examen-ubicacion/participantes", permission: "examenes_ubicacion" },
    { path: "/examen-ubicacion/configuracion", permission: "examenes_ubicacion" },
    { path: "/constancias", permission: "gestion_constancias" },
    { path: "/constancias/[id]", permission: "gestion_constancias" },
    { path: "/constancias/nueva", permission: "gestion_constancias" },
    { path: "/constancias/firmadas", permission: "gestion_constancias" },
    { path: "/constancias/entregadas", permission: "gestion_constancias" },
];

const SORTED_RULES = [...ROUTE_PERMISSION_RULES].sort((a, b) => b.path.length - a.path.length);

export function matchesPathPrefix(pathname: string, prefix: string): boolean {
    return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function getRequiredPermissionForPath(pathname: string): PermissionCode | undefined {
    for (const rule of SORTED_RULES) {
        if (matchesPathPrefix(pathname, rule.path)) {
            return rule.permission;
        }
    }
    return undefined;
}

export function getPermissionByExactPath(path: string): PermissionCode | undefined {
    return ROUTE_PERMISSION_RULES.find((rule) => rule.path === path)?.permission;
}

export function isProtectedPath(pathname: string): boolean {
    if (matchesPathPrefix(pathname, "/dashboard")) return true;
    return ROUTE_PERMISSION_RULES.some((rule) => matchesPathPrefix(pathname, rule.path));
}
