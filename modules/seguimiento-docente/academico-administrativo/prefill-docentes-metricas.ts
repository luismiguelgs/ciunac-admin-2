import { IPuntajesAcademicoAdmin } from "../opciones/perfil-types.interface";
import EncuestaService from "../encuestas/services/encuesta.service";
import { ICumplimientoDocente } from "./cumplimiento.interface";

interface BuildRowsFromMetricasParams {
    moduloId: string;
    academicoAdministrativoId: number;
    currentRows: ICumplimientoDocente[];
    puntajeOptions: IPuntajesAcademicoAdmin[];
}

type BuildRowsFromMetricasResult =
    | { status: "no-metricas" }
    | { status: "no-new" }
    | { status: "ok"; rows: ICumplimientoDocente[] };

export async function buildRowsFromEncuestaMetricas({
    moduloId,
    academicoAdministrativoId,
    currentRows,
    puntajeOptions,
}: BuildRowsFromMetricasParams): Promise<BuildRowsFromMetricasResult> {
    const metricas = await EncuestaService.getItemsByModulo(moduloId);

    if (!metricas.length) {
        return { status: "no-metricas" };
    }

    const existingDocenteIds = new Set(currentRows.map((row) => row.docenteId));
    const seenMetricasDocenteIds = new Set<string>();
    const maxPuntaje = puntajeOptions.length
        ? Math.max(...puntajeOptions.map((option) => option.puntaje))
        : 0;

    const usedNumericIds = new Set(
        currentRows
            .map((row) => row.id)
            .filter((id): id is number => typeof id === "number")
    );
    let nextTempId = -1;
    const getNextTempId = () => {
        while (usedNumericIds.has(nextTempId)) {
            nextTempId -= 1;
        }
        const id = nextTempId;
        usedNumericIds.add(id);
        nextTempId -= 1;
        return id;
    };

    const rowsToCreate: ICumplimientoDocente[] = [];

    metricas.forEach((metrica) => {
        if (seenMetricasDocenteIds.has(metrica.docenteId)) return;
        seenMetricasDocenteIds.add(metrica.docenteId);

        if (existingDocenteIds.has(metrica.docenteId)) return;

        rowsToCreate.push({
            id: getNextTempId(),
            moduloId: parseInt(moduloId),
            academicoAdministrativoId,
            docenteId: metrica.docenteId,
            puntaje: maxPuntaje,
            isNew: true,
            docente: {
                id: metrica.docente.id,
                nombres: metrica.docente.nombres,
                apellidos: metrica.docente.apellidos,
            },
        });
    });

    if (!rowsToCreate.length) {
        return { status: "no-new" };
    }

    return { status: "ok", rows: rowsToCreate };
}
