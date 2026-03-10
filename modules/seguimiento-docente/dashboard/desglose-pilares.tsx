'use client'

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import {
    Bar,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    RadialBar,
    RadialBarChart,
    Pie,
    PieChart,
    Cell,
    PolarAngleAxis,
    PolarGrid,
    Radar,
    RadarChart,
} from "recharts"

import {
    FileCheck,
    BarChart3,
    GraduationCap,
    Clock,
    UserCheck,
} from "lucide-react"

type Props = {
    perfilProfesional: {
        licenciatura: number,
        maestria: number,
        doctorado: number,
        b2: number,
        c1: number,
        c2: number,
        promedioHorasCapacitacion: number,
    },
    cumplimiento: { promedioPuntaje: number },
    gestionMetodologica: { promedioPuntaje: number },
    valoracionEstudiantil: { dimension: string, promedio: number }[],
}

export default function DesglosePorPilares({ perfilProfesional, cumplimiento, gestionMetodologica, valoracionEstudiantil }: Props) {
    const degreesData = [
        { degree: "licenciatura", count: perfilProfesional.licenciatura, fill: "var(--color-licenciatura)" },
        { degree: "maestria", count: perfilProfesional.maestria, fill: "var(--color-maestria)" },
        { degree: "doctorado", count: perfilProfesional.doctorado, fill: "var(--color-doctorado)" },
    ]

    const degreesConfig = {
        licenciatura: {
            label: "Licenciatura",
            color: "var(--chart-1)",
        },
        maestria: {
            label: "Maestría",
            color: "var(--chart-2)",
        },
        doctorado: {
            label: "Doctorado",
            color: "var(--chart-3)",
        },
    } satisfies ChartConfig

    const languageData = [
        { level: "B2", count: perfilProfesional.b2, fill: "var(--color-B2)" },
        { level: "C1", count: perfilProfesional.c1, fill: "var(--color-C1)" },
        { level: "C2", count: perfilProfesional.c2, fill: "var(--color-C2)" },
    ]

    const languageConfig = {
        B2: { label: "B2", color: "hsl(var(--primary))" },
        C1: { label: "C1", color: "hsl(var(--primary))" },
        C2: { label: "C2", color: "hsl(var(--primary))" },
    } satisfies ChartConfig


    const complianceData = [
        { name: "Puntual", value: cumplimiento.promedioPuntaje, fill: "var(--color-puntual)" },
        { name: "Atrasado", value: 100 - cumplimiento.promedioPuntaje, fill: "var(--chart-1)" },
    ]

    const complianceConfig = {
        value: {
            label: "Porcentaje",
        },
        puntual: {
            label: "A tiempo",
            color: "var(--chart-2)",
        },
        atrasado: {
            label: "Con demora",
            color: "var(--chart-1)",
        },
    } satisfies ChartConfig

    const studentDimensionsData = valoracionEstudiantil.map(d => ({
        dimension: d.dimension,
        label: `${d.dimension} (${d.promedio.toFixed(1)})`,
        score: d.promedio,
    }))

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* A. Perfil Profesional */}
            <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center gap-2 pb-2">
                    <GraduationCap className="h-5 w-5 text-blue-500" />
                    <div>
                        <CardTitle className="text-lg">A. Perfil Profesional (30%)</CardTitle>
                        <CardDescription>Grados y Certificaciones</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4 pb-2">
                    <div className="flex flex-col">
                        <p className="text-[10px] font-semibold mb-1 text-muted-foreground uppercase tracking-wider text-center">Grados Académicos</p>
                        <div className="h-[140px] w-full">
                            <ChartContainer config={degreesConfig} className="h-full w-full">
                                <PieChart>
                                    <Pie
                                        data={degreesData}
                                        dataKey="count"
                                        nameKey="degree"
                                        innerRadius={45}
                                        outerRadius={65}
                                        paddingAngle={5}
                                    >
                                        {degreesData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} strokeWidth={0} />
                                        ))}
                                    </Pie>
                                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                                </PieChart>
                            </ChartContainer>
                        </div>
                        {/* Custom Legend as Tags/Labels */}
                        <div className="flex flex-wrap justify-center gap-1.5 mt-2">
                            {degreesData.map((item) => (
                                <div
                                    key={item.degree}
                                    className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-muted/50 text-[9px] font-bold border border-border/50 shadow-sm"
                                >
                                    <div
                                        className="h-2 w-2 rounded-full"
                                        style={{ backgroundColor: degreesConfig[item.degree as keyof typeof degreesConfig].color }}
                                    />
                                    <span className="uppercase">{degreesConfig[item.degree as keyof typeof degreesConfig].label}</span>
                                    <span className="text-muted-foreground ml-0.5">{item.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col border-l border-border/50 pl-4">
                        <p className="text-[10px] font-semibold mb-1 text-muted-foreground uppercase tracking-wider text-center">Nivel de Idioma</p>
                        <div className="h-[140px] w-full">
                            <ChartContainer config={languageConfig} className="h-full w-full">
                                <BarChart data={languageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
                                    <XAxis
                                        dataKey="level"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fontWeight: 600 }}
                                    />
                                    <YAxis hide domain={[0, 'dataMax + 1']} />
                                    <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={40}>
                                        {languageData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                    <ChartTooltip cursor={{ fill: 'transparent' }} content={<ChartTooltipContent hideLabel />} />
                                </BarChart>
                            </ChartContainer>
                        </div>

                    </div>
                </CardContent>
                <CardFooter className="pt-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground w-full justify-center bg-muted/30 py-2 rounded-lg border border-border/40">
                        <Clock className="h-3.5 w-3.5 text-blue-500" />
                        <span>{perfilProfesional.promedioHorasCapacitacion.toFixed(1)} HRS DE CAPACITACIÓN PROMEDIO</span>
                    </div>
                </CardFooter>
            </Card>

            {/* B. Cumplimiento Académico */}
            <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center gap-2">
                    <FileCheck className="h-5 w-5 text-emerald-500" />
                    <div>
                        <CardTitle className="text-lg">B. Cumplimiento (20%)</CardTitle>
                        <CardDescription>Tasa de Entrega Oportuna</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="h-[230px] flex flex-col items-center justify-center">
                    <div className="w-full h-full max-w-[250px] relative">
                        <ChartContainer config={complianceConfig} className="w-full h-full">
                            <RadialBarChart
                                innerRadius="75%" outerRadius="100%"
                                data={complianceData}
                                startAngle={180} endAngle={0}
                            >
                                <RadialBar
                                    background
                                    dataKey="value"
                                    cornerRadius={12}
                                />
                                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                            </RadialBarChart>
                        </ChartContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-end pb-8">
                            <span className="text-3xl font-black text-foreground">{cumplimiento.promedioPuntaje.toFixed(1)}%</span>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">A tiempo</span>
                        </div>
                    </div>
                    <div className="flex gap-4 mt-2">
                        <div className="flex items-center gap-1.5">
                            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: complianceConfig.puntual.color }} />
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">Puntual</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: complianceConfig.atrasado.color }} />
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">Atrasado</span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="text-center justify-center pt-2">
                    <div className="px-4 py-1.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-full border border-emerald-100 dark:border-emerald-900/50">
                        <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">EFECTIVIDAD DE ENTREGA ÓPTIMA</p>
                    </div>
                </CardFooter>
            </Card>

            {/* C. Gestión de Aula */}
            <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center gap-2">
                    <UserCheck className="h-5 w-5 text-amber-500" />
                    <div>
                        <CardTitle className="text-lg">C. Gestión y Metodología (20%)</CardTitle>
                        <CardDescription>Promedio de Supervisión</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center h-[200px]">
                    <div className="relative flex items-center justify-center">
                        <div className="text-5xl font-black text-amber-500">{gestionMetodologica.promedioPuntaje.toFixed(2)}</div>
                        <div className="absolute -top-4 -right-8 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-[10px] font-black text-amber-600 dark:text-amber-400 rounded border border-amber-200 dark:border-amber-800">PTS</div>
                    </div>
                    <div className="text-[11px] font-bold text-muted-foreground mt-2 uppercase tracking-widest">Calificación Supervisión</div>
                    <div className="w-full max-w-xs mt-6 h-3 bg-muted rounded-full overflow-hidden p-0.5 border border-border/50">
                        <div
                            className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                            style={{ width: `${gestionMetodologica.promedioPuntaje}%` }}
                        />
                    </div>
                    <div className="flex justify-between w-full max-w-xs mt-1.5 px-0.5">
                        <span className="text-[9px] font-bold text-muted-foreground">0</span>
                        <span className="text-[9px] font-bold text-muted-foreground text-center">NORMALIZADO (100)</span>
                        <span className="text-[9px] font-bold text-muted-foreground">100</span>
                    </div>
                </CardContent>
            </Card>

            {/* D. Valoración Estudiantil */}
            <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-500" />
                    <div>
                        <CardTitle className="text-lg">D. Valoración Estudiantil (30%)</CardTitle>
                        <CardDescription>Nivel de Satisfacción Global</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="h-[280px]">
                    <div className="h-full w-full">
                        <ChartContainer config={{}} className="h-full w-full">
                            <RadarChart data={studentDimensionsData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                                <PolarGrid strokeOpacity={0.3} />
                                <PolarAngleAxis
                                    dataKey="label"
                                    tick={{ fontSize: 11, fontWeight: 700, fill: 'hsl(var(--muted-foreground))' }}
                                />
                                <Radar
                                    name="Puntaje"
                                    dataKey="score"
                                    stroke="hsl(var(--chart-4))"
                                    fill="hsl(var(--chart-4))"
                                    fillOpacity={0.3}
                                    strokeWidth={3}
                                />
                                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                            </RadarChart>
                        </ChartContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
