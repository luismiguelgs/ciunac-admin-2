import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, BookOpen, Briefcase, GraduationCap, ScrollText } from "lucide-react";
import React from "react";
import IDocumentosPerfil from "../../perfil-docente/interfaces/documentos-perfil.interface";
import { PerfilDocente } from "../../perfil-docente/interfaces/perfil-docente.interface";

interface DetalleRankingPerfilProps {
    documentos: IDocumentosPerfil[];
    perfilDocente: PerfilDocente | null;
}

export default function DetalleRankingPerfil({ documentos, perfilDocente }: DetalleRankingPerfilProps) {
    // Categorización basada en IDs proporcionados:
    // Grados: 1, 2, 3
    // Diplomas: 3, 4
    // Capacitaciones: 6, 7
    // Experiencia: 8

    const gradosAcademicos = documentos.filter(doc => [1, 2, 3].includes(doc.tipoDocumentoPerfilId));
    const diplomas = documentos.filter(doc => [3, 4].includes(doc.tipoDocumentoPerfilId));
    const capacitaciones = documentos.filter(doc => [6, 7].includes(doc.tipoDocumentoPerfilId));
    const experienciaDocs = documentos.filter(doc => doc.tipoDocumentoPerfilId === 8);
    // El ID 8 es para experiencia, pero además de los datos consolidados del perfilDocente, mostramos la lista.

    return (
        <React.Fragment>
            <Card className="md:col-span-2 xl:col-span-3 border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
                <CardHeader className="pb-4 border-b border-border/50 bg-muted/20">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Award className="h-5 w-5 text-primary" />
                        Detalle de Perfil Profesional (30%)
                    </CardTitle>
                    <CardDescription>Grados académicos, diplomas, capacitaciones y experiencia confirmada.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">

                    {/* Grados Académicos */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-sm flex items-center gap-2 text-foreground border-b pb-2">
                            <GraduationCap className="h-4 w-4 text-primary" />
                            Grados Académicos
                        </h4>
                        <div className="space-y-3">
                            {gradosAcademicos.map((grado, i) => (
                                <div key={i} className="flex flex-col p-4 rounded-xl bg-background border hover:border-primary/30 hover:bg-primary/5 transition-colors shadow-sm">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">{grado.tipoDocumentoPerfil?.nombre}</span>
                                    <span className="text-sm font-bold leading-tight text-foreground">{grado.descripcion}</span>
                                    <div className="flex justify-between items-center mt-3 text-xs text-muted-foreground pt-3 border-t border-border/50">
                                        <span className="truncate mr-2 font-medium" title={grado.institucionEmisora}>{grado.institucionEmisora}</span>
                                        <Badge variant="outline" className="text-[10px] h-5 px-1.5 shrink-0 bg-background">
                                            {grado.fechaEmision ? new Date(grado.fechaEmision).getFullYear() : '-'}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                            {gradosAcademicos.length === 0 && (
                                <p className="text-xs text-muted-foreground italic">No se encontraron grados académicos.</p>
                            )}
                        </div>
                    </div>

                    {/* Diplomas y Certificados */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-sm flex items-center gap-2 text-foreground border-b pb-2">
                            <ScrollText className="h-4 w-4 text-primary" />
                            Diplomas y Certificados
                        </h4>
                        <div className="space-y-3">
                            {diplomas.map((diploma, i) => (
                                <div key={i} className="flex flex-col p-4 rounded-xl bg-background border hover:border-primary/30 hover:bg-primary/5 transition-colors shadow-sm">
                                    <span className="text-sm font-bold leading-tight text-foreground">{diploma.descripcion}</span>
                                    <div className="flex justify-between items-center mt-3 text-xs text-muted-foreground pt-3 border-t border-border/50">
                                        <Badge variant="secondary" className="text-[10px] bg-muted">{diploma.horasCapacitacion} horas</Badge>
                                        <Badge variant="outline" className="text-[10px] h-5 px-1.5 bg-background">
                                            {diploma.fechaEmision ? new Date(diploma.fechaEmision).getFullYear() : '-'}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                            {diplomas.length === 0 && (
                                <p className="text-xs text-muted-foreground italic">No se encontraron diplomas o certificados.</p>
                            )}

                            <div className="flex flex-col gap-3 pt-4 border-t border-border/50 mt-4">
                                <div className="flex justify-between items-center p-4 rounded-xl bg-primary/5 border border-primary/20 shadow-sm">
                                    <span className="text-[10px] font-bold text-foreground uppercase tracking-wider">Nivel de Idioma<br />(MCER)</span>
                                    <Badge className="text-sm h-7 px-3 bg-primary text-primary-foreground shadow-md">{perfilDocente?.nivelIdioma ?? '-'}</Badge>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Capacitaciones */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-sm flex items-center gap-2 text-foreground border-b pb-2">
                            <BookOpen className="h-4 w-4 text-primary" />
                            Capacitaciones / Cursos
                        </h4>
                        <div className="space-y-3">
                            {capacitaciones.map((cap, i) => (
                                <div key={i} className="flex flex-col p-4 rounded-xl bg-background border hover:border-primary/30 hover:bg-primary/5 transition-colors shadow-sm">
                                    <span className="text-sm font-bold leading-tight text-foreground">{cap.descripcion}</span>
                                    <div className="flex justify-between items-center mt-3 text-xs text-muted-foreground pt-3 border-t border-border/50">
                                        <Badge variant="secondary" className="text-[10px] bg-muted">{cap.horasCapacitacion} horas</Badge>
                                        <Badge variant="outline" className="text-[10px] h-5 px-1.5 bg-background">
                                            {cap.fechaEmision ? new Date(cap.fechaEmision).getFullYear() : '-'}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                            {capacitaciones.length === 0 && (
                                <p className="text-xs text-muted-foreground italic">No se encontraron capacitaciones.</p>
                            )}
                        </div>
                    </div>

                    {/* Experiencia Profesional */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-sm flex items-center gap-2 text-foreground border-b pb-2">
                            <Briefcase className="h-4 w-4 text-primary" />
                            Experiencia Profesional
                        </h4>
                        <div className="space-y-4">
                            <div className="space-y-3">
                                {experienciaDocs.map((exp, i) => (
                                    <div key={i} className="flex flex-col p-4 rounded-xl bg-background border hover:border-primary/30 hover:bg-primary/5 transition-colors shadow-sm">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">{exp.institucionEmisora}</span>
                                        <span className="text-sm font-bold leading-tight text-foreground">{exp.descripcion}</span>
                                        <div className="flex justify-between items-center mt-3 text-xs text-muted-foreground pt-3 border-t border-border/50">
                                            <Badge variant="secondary" className="text-[10px] bg-muted">{(exp.experienciaLaboral / 12).toFixed(1)} años</Badge>
                                            <Badge variant="outline" className="text-[10px] h-5 px-1.5 bg-background">
                                                {exp.fechaEmision ? new Date(exp.fechaEmision).getFullYear() : '-'}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                                {experienciaDocs.length === 0 && (
                                    <p className="text-xs text-muted-foreground italic">No se registraron experiencias individuales.</p>
                                )}
                            </div>

                            <div className="flex flex-col gap-3 pt-2 border-t border-border/50">
                                <div className="flex justify-between items-center p-4 rounded-xl bg-background border shadow-sm">
                                    <span className="text-xs font-medium text-muted-foreground">Años de experiencia<br />global</span>
                                    <span className="text-lg font-black text-primary">{Number(perfilDocente?.experienciaTotal ?? 0) / 12} años</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </CardContent>
            </Card>
        </React.Fragment>
    )
}
