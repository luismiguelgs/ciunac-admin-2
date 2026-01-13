-- 1. Crear el tipo ENUM para NivelIdioma (si no existe aún)
-- Ajusta los valores según lo que necesites
CREATE TYPE "NivelIdioma" AS ENUM ('B2', 'C1', 'C2');

-- 3. Tabla: perfil_docente
CREATE TABLE perfil_docente (
    id SERIAL PRIMARY KEY,
    
    -- Relación 1 a 1 con docentes (UUID + UNIQUE)
    docente_id UUID NOT NULL UNIQUE,
    
    experiencia_total INT NOT NULL,
    
    -- Relación Muchos a Uno con idiomas
    idioma_id INT NOT NULL,
    
    -- Uso del ENUM creado arriba
    nivel_idioma "NivelIdioma",
    
    puntaje_final INT NOT NULL,
    
    creado_en TIMESTAMP DEFAULT now(),
    modificado_en TIMESTAMP DEFAULT now(),

    -- Restricciones de Llaves Foráneas
    CONSTRAINT fk_perfil_docente_docente 
        FOREIGN KEY (docente_id) 
        REFERENCES docentes(id) 
        ON DELETE CASCADE,

    CONSTRAINT fk_perfil_docente_idioma 
        FOREIGN KEY (idioma_id) 
        REFERENCES idiomas(id)
);

CREATE TABLE tipos_documento_perfil (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR NOT NULL,
    puntaje INT NOT NULL DEFAULT 0
);

CREATE TABLE documentos_docente (
    id SERIAL PRIMARY KEY,
    
    -- Llaves foráneas
    perfil_docente_id INT NOT NULL,
    tipo_documento_perfil_id INT NOT NULL,
    estado_id INT NOT NULL, -- Referencia a la tabla existente 'estados'
    
    -- Campos de datos
    descripcion VARCHAR NOT NULL,
    institucion_emisora VARCHAR NOT NULL,
    url_archivo VARCHAR NOT NULL,
    fecha_emision DATE,
    
    -- Campos numéricos con valores por defecto
    horas_capacitacion INT NOT NULL DEFAULT 0,
    puntaje INT NOT NULL DEFAULT 0,
    experiencia_laboral INT NOT NULL DEFAULT 0,
    
    -- Auditoría (Agregados según tu modificación)
    creado_en TIMESTAMP DEFAULT now(),
    modificado_en TIMESTAMP DEFAULT now(),

    -- Restricciones (Constraints)
    CONSTRAINT fk_documentos_perfil 
        FOREIGN KEY (perfil_docente_id) 
        REFERENCES perfil_docente(id)
        ON DELETE CASCADE, -- Si se borra el perfil, se borran los documentos

    CONSTRAINT fk_documentos_tipo 
        FOREIGN KEY (tipo_documento_perfil_id) 
        REFERENCES tipo_documento_perfil(id),

    CONSTRAINT fk_documentos_estado 
        FOREIGN KEY (estado_id) 
        REFERENCES estados(id)
);

CREATE TABLE academico_administrativo (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR NOT NULL,
    peso DOUBLE PRECISION NOT NULL
);

CREATE TABLE puntaje_academico_administrativo (
    id SERIAL PRIMARY KEY,
    
    -- Relación: Muchos puntajes pertenecen a una categoría administrativo/académica
    academico_administrativo_id INT NOT NULL,
    
    nombre VARCHAR NOT NULL,
    puntaje INT NOT NULL,

    -- Definición de la llave foránea
    CONSTRAINT fk_puntaje_aa_categoria
        FOREIGN KEY (academico_administrativo_id) 
        REFERENCES academico_administrativo(id)
        ON DELETE CASCADE -- Si borras la categoría padre, se borran sus puntajes hijos
);

CREATE TABLE cumplimiento_docente (
    id SERIAL PRIMARY KEY,
    
    modulo_id INT NOT NULL,
    docente_id UUID NOT NULL,
    academico_administrativo_id INT NOT NULL,
    
    -- Se agregó DEFAULT 0 y NOT NULL
    puntaje INT NOT NULL DEFAULT 0,

    -- Definición de Llaves Foráneas
    CONSTRAINT fk_cumplimiento_modulo 
        FOREIGN KEY (modulo_id) 
        REFERENCES modulos(id),

    CONSTRAINT fk_cumplimiento_docente 
        FOREIGN KEY (docente_id) 
        REFERENCES docentes(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_cumplimiento_acad_admin 
        FOREIGN KEY (academico_administrativo_id) 
        REFERENCES academico_administrativo(id)
);

CREATE TABLE encuesta_preguntas (
    id SERIAL PRIMARY KEY,
    orden INT NOT NULL,
    texto_pregunta VARCHAR NOT NULL,
    dimension VARCHAR, -- Puede ser NULL
    activo BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE encuesta_respuestas (
    id SERIAL PRIMARY KEY,
    
    -- Llave foránea a la tabla grupos
    grupo_id INT NOT NULL,
    
    -- Nota: Definido como INT. Si necesitas decimales (ej. 15.5), considera cambiarlo a NUMERIC o FLOAT.
    promedio_ponderado INT NOT NULL,
    
    creado_en TIMESTAMP DEFAULT now(),
    modificado_en TIMESTAMP DEFAULT now(),

    -- Restricción de Llave Foránea
    CONSTRAINT fk_encuesta_respuestas_grupo 
        FOREIGN KEY (grupo_id) 
        REFERENCES grupos(id)
);

CREATE TABLE encuesta_respuestas_detalle (
    id SERIAL PRIMARY KEY,
    
    -- Relación con la cabecera de la respuesta (encuesta_respuestas)
    encuesta_id INT NOT NULL,
    
    -- Relación con la pregunta específica (encuesta_preguntas)
    pregunta_id INT NOT NULL,
    
    valor_texto VARCHAR NOT NULL,
    valor_numero INT NOT NULL,

    -- Restricciones de Llave Foránea
    CONSTRAINT fk_detalle_encuesta 
        FOREIGN KEY (encuesta_id) 
        REFERENCES encuesta_respuestas(id)
        ON DELETE CASCADE, -- Si se borra la encuesta general, se borran sus detalles

    CONSTRAINT fk_detalle_pregunta 
        FOREIGN KEY (pregunta_id) 
        REFERENCES encuesta_preguntas(id)
);