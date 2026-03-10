"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {
    Bar,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    RadialBar,
    RadialBarChart,
    PolarAngleAxis,
} from "recharts"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Users,
    Trophy,
    MessageSquare,
    TrendingUp,
} from "lucide-react"
import { IPerfilResultado } from "../ranking-docentes/interfaces/perfil-resultado.interface"

// --- Mock Data Section 1: Global Indicators ---

const globalMetrics = [
    {
        title: "Promedio General del Periodo",
        value: "82.5",
        description: "Meta: 85.0",
        icon: Trophy,
        color: "text-amber-500",
        suffix: "/100"
    },
    {
        title: "Docentes Evaluados",
        value: "142",
        description: "98% del total",
        icon: Users,
        color: "text-blue-500",
    },
    {
        title: "Volumen Encuestas",
        value: "1,248",
        description: "+15% vs ciclo anterior",
        icon: MessageSquare,
        color: "text-emerald-500",
    },
]

// --- Chart Configs ---

const distributionConfig = {
    count: { label: "Docentes" },
} satisfies ChartConfig

const radialConfig = {
    score: { label: "Puntaje" },
} satisfies ChartConfig

type Props = {
    indicadoresGlobales: {
        promedio: number
        docentesEvaluados: number
        docentesActivos: number
        encuestasRealizadas: number
        encuestasPeriodoAnterior: number
    },
    desempeñoGeneral: {
        moduloId: number
        promedioGeneral: number
        excelente: number
        bueno: number
        regular: number
        deficiente: number
        totalEvaluados: number
    },
    rankingDocentes: IPerfilResultado[]
}

export default function IndicadoresGlobales({ indicadoresGlobales, desempeñoGeneral, rankingDocentes }: Props) {
    globalMetrics[0].value = String(indicadoresGlobales?.promedio.toFixed(2))
    globalMetrics[1].value = String(indicadoresGlobales?.docentesEvaluados)
    globalMetrics[1].description = `${(indicadoresGlobales?.docentesEvaluados / indicadoresGlobales?.docentesActivos * 100).toFixed(2)}% del total`
    globalMetrics[2].value = String(indicadoresGlobales?.encuestasRealizadas)
    globalMetrics[2].description = indicadoresGlobales?.encuestasPeriodoAnterior > 0 ? `${((indicadoresGlobales?.encuestasRealizadas - indicadoresGlobales?.encuestasPeriodoAnterior) / indicadoresGlobales?.encuestasPeriodoAnterior * 100).toFixed(2)}% vs ciclo anterior` : "0% vs ciclo anterior"

    const distributionData = [
        { category: "Excelente", count: desempeñoGeneral?.excelente, fill: "hsl(var(--chart-2))" },
        { category: "Bueno", count: desempeñoGeneral?.bueno, fill: "hsl(var(--chart-1))" },
        { category: "Regular", count: desempeñoGeneral?.regular, fill: "hsl(var(--chart-3))" },
        { category: "Deficiente", count: desempeñoGeneral?.deficiente, fill: "hsl(var(--chart-5))" },
    ]

    const rankingData = [
        { name: `${rankingDocentes[0]?.docente?.nombres} ${rankingDocentes[0]?.docente?.apellidos}`, score: rankingDocentes[0]?.resultadoFinal, status: "Excelente", position: "Top" },
        { name: `${rankingDocentes[1]?.docente?.nombres} ${rankingDocentes[1]?.docente?.apellidos}`, score: rankingDocentes[1]?.resultadoFinal, status: "Excelente", position: "Top" },
        { name: `${rankingDocentes[2]?.docente?.nombres} ${rankingDocentes[2]?.docente?.apellidos}`, score: rankingDocentes[2]?.resultadoFinal, status: "Excelente", position: "Top" },
        { name: `${rankingDocentes[3]?.docente?.nombres} ${rankingDocentes[3]?.docente?.apellidos}`, score: rankingDocentes[3]?.resultadoFinal, status: "Deficiente", position: "Bottom" },
        { name: `${rankingDocentes[4]?.docente?.nombres} ${rankingDocentes[4]?.docente?.apellidos}`, score: rankingDocentes[4]?.resultadoFinal, status: "Deficiente", position: "Bottom" },
    ]

    return (
        <div className="space-y-6">
            {/* Global Metrics Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                {globalMetrics.map((metric, i) => (
                    <Card key={i} className="overflow-hidden border-l-4" style={{ borderLeftColor: `var(--${metric.color.split('-')[1]}-500)` }}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                            <metric.icon className={`h-4 w-4 ${metric.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {metric.value}
                                {metric.suffix && <span className="text-muted-foreground text-sm font-normal ml-1">{metric.suffix}</span>}
                            </div>
                            <p className="text-muted-foreground text-xs mt-1">{metric.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                {/* Performance Distribution */}
                <Card className="lg:col-span-4 h-full">
                    <CardHeader>
                        <CardTitle>Distribución de Desempeño</CardTitle>
                        <CardDescription>Clasificación según puntaje final acumulado</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={distributionConfig} className="aspect-auto h-[300px] w-full">
                            <BarChart data={distributionData} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid horizontal={false} strokeDasharray="3 3" opacity={0.5} />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="category"
                                    type="category"
                                    tickLine={false}
                                    axisLine={false}
                                    className="font-medium"
                                />
                                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                                <Bar dataKey="count" radius={6} barSize={40} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                    <CardFooter className="flex-col items-start gap-2 text-sm">
                        <div className="flex gap-2 font-medium leading-none">
                            {((desempeñoGeneral?.excelente + desempeñoGeneral?.bueno) / desempeñoGeneral?.totalEvaluados * 100).toFixed(2)}% de los docentes están en rangos óptimos <TrendingUp className="h-4 w-4 text-emerald-500" />
                        </div>
                    </CardFooter>
                </Card>

                {/* Radial Average */}
                <Card className="lg:col-span-3 h-full">
                    <CardHeader>
                        <CardTitle>Salud General</CardTitle>
                        <CardDescription>Cumplimiento de metas globales</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center min-h-[300px]">
                        <ChartContainer config={radialConfig} className="mx-auto aspect-square w-full max-w-[250px]">
                            <RadialBarChart
                                innerRadius="70%"
                                outerRadius="100%"
                                data={[{ value: desempeñoGeneral?.promedioGeneral, fill: "hsl(var(--chart-2))" }]}
                                startAngle={90}
                                endAngle={-270}
                            >
                                <RadialBar dataKey="value" cornerRadius={10} background />
                                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                                <text
                                    x="50%"
                                    y="50%"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    className="fill-foreground text-4xl font-bold"
                                >
                                    {desempeñoGeneral?.promedioGeneral.toFixed(2)}%
                                </text>
                                <text
                                    x="50%"
                                    y="62%"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    className="fill-muted-foreground text-xs font-medium uppercase tracking-wider"
                                >
                                    Puntaje Global
                                </text>
                            </RadialBarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Ranking Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Ranking de Docentes (Top / Bottom)</CardTitle>
                    <CardDescription>Docentes con mayor y menor puntuación en el ciclo actual</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Docente</TableHead>
                                <TableHead>Puntaje Final</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="text-right">Segmento</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rankingData.map((row) => (
                                <TableRow key={row.name}>
                                    <TableCell className="font-medium">{row.name}</TableCell>
                                    <TableCell>{row.score}/100</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${row.status === "Excelente" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                                            }`}>
                                            {row.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {row.position === "Top" ? (
                                            <span className="text-emerald-600 font-bold">↑ Top</span>
                                        ) : (
                                            <span className="text-red-500 font-bold">↓ Crit</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};