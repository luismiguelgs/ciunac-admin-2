CREATE TYPE "TipoDocumento" AS ENUM (
  'DNI',
  'CE',
  'PASAPORTE'
);

CREATE TYPE "Genero" AS ENUM (
  'M',
  'F'
);

CREATE TYPE "TipoAula" AS ENUM (
  'VIRTUAL',
  'FISICA'
);

CREATE TYPE "EstadoReferencia" AS ENUM (
  'SOLICITUD',
  'EXAMEN_UBICACION',
  'CERTIFICADO',
  'PERFIL_DOCENTE'
);

CREATE TYPE "UsuarioRol" AS ENUM (
  'ESTUDIANTE',
  'DOCENTE',
  'ADMINISTRATIVO',
  'SUPERADMIN'
);

CREATE TYPE "NivelIdioma" AS ENUM (
  'B2',
  'C1',
  'C2'
);

CREATE TABLE "usuarios" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "email" varchar UNIQUE NOT NULL,
  "password" varchar NOT NULL,
  "proveedor" varchar,
  "proveedor_id" varchar,
  "refresh_token_hash" varchar,
  "rol" "UsuarioRol" NOT NULL DEFAULT 'ESTUDIANTE',
  "creado_en" timestamp DEFAULT (now()),
  "modificado_en" timestamp DEFAULT (now())
);

CREATE TABLE "permisos" (
  "id" serial PRIMARY KEY,
  "codigo" varchar UNIQUE NOT NULL,
  "modulo" varchar
);

CREATE TABLE "rol_permisos" (
  "id" serial PRIMARY KEY,
  "rol" "UsuarioRol" NOT NULL,
  "permiso_id" int NOT NULL,
  "descripcion" varchar
);

CREATE TABLE "facultades" (
  "id" serial PRIMARY KEY,
  "nombre" varchar NOT NULL,
  "codigo" varchar NOT NULL
);

CREATE TABLE "escuelas" (
  "id" serial PRIMARY KEY,
  "nombre" varchar NOT NULL,
  "facultad_id" int NOT NULL
);

CREATE TABLE "estudiantes" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "nombres" varchar NOT NULL,
  "apellidos" varchar NOT NULL,
  "genero" "Genero",
  "usuario_id" uuid NOT NULL,
  "fecha_nacimiento" date,
  "tipo_documento" "TipoDocumento" NOT NULL DEFAULT 'DNI',
  "numero_documento" varchar NOT NULL,
  "celular" varchar,
  "img_doc" varchar,
  "facultad_id" int,
  "escuela_id" int,
  "codigo" varchar,
  "email" varchar,
  "direccion" varchar,
  "creado_en" timestamp DEFAULT (now()),
  "modificado_en" timestamp DEFAULT (now())
);

CREATE TABLE "docentes" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "usuario_id" uuid NOT NULL,
  "nombres" varchar NOT NULL,
  "apellidos" varchar NOT NULL,
  "genero" "Genero",
  "celular" varchar,
  "fecha_nacimiento" date,
  "activo" bool DEFAULT true,
  "tipo_documento" "TipoDocumento",
  "numero_documento" varchar,
  "creado_en" timestamp DEFAULT (now()),
  "modificado_en" timestamp DEFAULT (now())
);

CREATE TABLE "idiomas" (
  "id" serial PRIMARY KEY,
  "nombre" varchar NOT NULL
);

CREATE TABLE "niveles" (
  "id" serial PRIMARY KEY,
  "nombre" varchar NOT NULL,
  "orden" int
);

CREATE TABLE "ciclos" (
  "id" serial PRIMARY KEY,
  "idioma_id" int NOT NULL,
  "nivel_id" int NOT NULL,
  "nombre" varchar NOT NULL,
  "numero_ciclo" int,
  "codigo" varchar
);

CREATE TABLE "grupos" (
  "id" serial PRIMARY KEY,
  "modulos_id" int NOT NULL,
  "ciclo_id" int NOT NULL,
  "codigo" varchar,
  "docente_id" uuid NOT NULL,
  "aula_id" int NOT NULL,
  "frecuencia" varchar(4),
  "modalidad" varchar(4),
  "creado_en" timestamp DEFAULT (now()),
  "modificado_en" timestamp DEFAULT (now())
);

CREATE TABLE "aulas" (
  "id" serial PRIMARY KEY,
  "capacidad" int,
  "nombre" varchar NOT NULL,
  "tipo" "TipoAula",
  "ubicacion" varchar
);

CREATE TABLE "modulos" (
  "id" serial PRIMARY KEY,
  "nombre" varchar,
  "orden" int,
  "fecha_inicio" date NOT NULL,
  "fecha_fin" date NOT NULL,
  "activo" boolean
);

CREATE TABLE "evaluaciones" (
  "id" serial PRIMARY KEY,
  "nombre" varchar NOT NULL,
  "porcentaje" decimal(5,2) NOT NULL,
  "periodo_id" int NOT NULL,
  "activo" bool,
  "creado_en" timestamp DEFAULT (now()),
  "modificado_en" timestamp DEFAULT (now())
);

CREATE TABLE "notas" (
  "id" serial PRIMARY KEY,
  "estudiante_id" uuid NOT NULL,
  "grupo_id" int NOT NULL,
  "evaluacion_id" int NOT NULL,
  "nota" numeric NOT NULL DEFAULT 0,
  "creado_en" timestamp DEFAULT (now()),
  "modificado_en" timestamp DEFAULT (now())
);

CREATE TABLE "notas_final" (
  "id" serial PRIMARY KEY,
  "estudiante_id" uuid NOT NULL,
  "grupo_id" int NOT NULL,
  "nota" int NOT NULL,
  "aprobado" bool,
  "creado_en" timestamp DEFAULT (now()),
  "modificado_en" timestamp DEFAULT (now())
);

CREATE TABLE "tipos_solicitud" (
  "id" serial PRIMARY KEY,
  "solicitud" varchar NOT NULL,
  "precio" numeric
);

CREATE TABLE "estados" (
  "id" serial PRIMARY KEY,
  "nombre" varchar NOT NULL,
  "referencia" "EstadoReferencia"
);

CREATE TABLE "solicitudes" (
  "id" serial PRIMARY KEY,
  "estudiante_id" uuid NOT NULL,
  "tipo_solicitud_id" int NOT NULL,
  "idioma_id" int NOT NULL,
  "nivel_id" int NOT NULL,
  "estado_id" int NOT NULL,
  "periodo" varchar,
  "alumno_ciunac" bool,
  "fecha_pago" date,
  "pago" decimal(5,2),
  "numero_voucher" varchar,
  "img_cert_estudio" varchar,
  "img_voucher" varchar,
  "digital" bool DEFAULT false,
  "manual" bool DEFAULT false,
  "observaciones" varchar,
  "creado_en" timestamp DEFAULT (now()),
  "modificado_en" timestamp DEFAULT (now())
);

CREATE TABLE "examenes_ubicacion" (
  "id" serial PRIMARY KEY,
  "codigo" varchar UNIQUE,
  "fecha" date,
  "estado_id" int NOT NULL,
  "idioma_id" int NOT NULL,
  "docente_id" uuid NOT NULL,
  "aula_id" int NOT NULL,
  "creado_en" timestamp DEFAULT (now()),
  "modificado_en" timestamp DEFAULT (now())
);

CREATE TABLE "calificaciones_ubicacion" (
  "id" serial PRIMARY KEY,
  "idioma_id" int NOT NULL,
  "nivel_id" int NOT NULL,
  "ciclo_id" int NOT NULL,
  "nota_min" int,
  "nota_max" int
);

CREATE TABLE "detalles_ubicacion" (
  "id" serial PRIMARY KEY,
  "solicitud_id" int NOT NULL,
  "idioma_id" int NOT NULL,
  "nivel_id" int NOT NULL,
  "examen_id" int NOT NULL,
  "estudiante_id" uuid NOT NULL,
  "nota" int,
  "calificacion_id" int NOT NULL,
  "terminado" bool,
  "activo" bool,
  "creado_en" timestamp DEFAULT (now()),
  "modificado_en" timestamp DEFAULT (now())
);

CREATE TABLE "cronograma_ubicacion" (
  "id" serial PRIMARY KEY,
  "modulo_id" int NOT NULL,
  "fecha" date NOT NULL,
  "activo" bool,
  "creado_en" timestamp DEFAULT (now()),
  "modificado_en" timestamp DEFAULT (now())
);

CREATE TABLE "perfil_docente" (
  "id" uuid PRIMARY KEY,
  "docente_id" uuid UNIQUE NOT NULL,
  "experiencia_total" int NOT NULL,
  "idioma_id" int NOT NULL,
  "nivel_idioma" "NivelIdioma",
  "puntaje_final" int NOT NULL,
  "visible" bool DEFAULT true,
  "creado_en" timestamp DEFAULT (now()),
  "modificado_en" timestamp DEFAULT (now())
);

CREATE TABLE "tipo_documento_perfil" (
  "id" serial PRIMARY KEY,
  "nombre" varchar NOT NULL,
  "puntaje" int NOT NULL DEFAULT 0
);

CREATE TABLE "documentos_docente" (
  "id" serial PRIMARY KEY,
  "perfil_docente_id" uuid NOT NULL,
  "tipo_documento_perfil_id" int NOT NULL,
  "estado_id" int NOT NULL,
  "descripcion" varchar NOT NULL,
  "institucion_emisora" varchar NOT NULL,
  "url_archivo" varchar NOT NULL,
  "fecha_emision" date,
  "horas_capacitacion" int NOT NULL DEFAULT 0,
  "puntaje" int NOT NULL DEFAULT 0,
  "experiencia_laboral" int NOT NULL DEFAULT 0,
  "creado_en" timestamp DEFAULT (now()),
  "modificado_en" timestamp DEFAULT (now())
);

CREATE TABLE "academico_administrativo" (
  "id" serial PRIMARY KEY,
  "nombre" varchar NOT NULL,
  "peso" float NOT NULL
);

CREATE TABLE "puntaje_academico_administrativo" (
  "id" serial PRIMARY KEY,
  "academico_administrativo_id" int NOT NULL,
  "nombre" varchar NOT NULL,
  "puntaje" int NOT NULL
);

CREATE TABLE "cumplimiento_docente" (
  "id" serial PRIMARY KEY,
  "modulo_id" int NOT NULL,
  "docente_id" uuid NOT NULL,
  "academico_adminstrativo_id" int NOT NULL,
  "puntaje" int
);

CREATE TABLE "encuesta_preguntas" (
  "id" serial PRIMARY KEY,
  "orden" int NOT NULL,
  "texto_pregunta" varchar NOT NULL,
  "dimension" varchar,
  "activo" bool NOT NULL DEFAULT true
);

CREATE TABLE "encuesta_metricas_docente" (
  "id" serial PRIMARY KEY,
  "docente_id" uuid NOT NULL,
  "modulo_id" int NOT NULL,
  "promedio_general" decimal(5,2),
  "total_encuestados" int,
  "total_cursos" int,
  "fecha_registro" timestamp DEFAULT (now())
);

CREATE TABLE "encuesta_respuestas" (
  "id" serial PRIMARY KEY,
  "docente_id" uuid NOT NULL,
  "periodo" varchar(10),
  "grupo" varchar(40),
  "estudiante" varchar(200),
  "promedio_individual" decimal(5,2),
  "comentario" TEXT,
  "fecha_registro" timestamp DEFAULT (now())
);

CREATE TABLE "encuesta_respuestas_detalle" (
  "id" serial PRIMARY KEY,
  "respuesta_id" int NOT NULL,
  "pregunta_id" int NOT NULL,
  "valor_texto" varchar NOT NULL,
  "valor_numero" int NOT NULL
);

CREATE TABLE "perfil_docente_resultados" (
  "id" serial PRIMARY KEY,
  "perfil_docente_id" uuid NOT NULL,
  "resultado_final" decimal(5,2),
  "modulo_id" int NOT NULL,
  "docente_id" uuid NOT NULL,
  "creado_en" timestamp,
  "modificado_en" timestamp
);

CREATE INDEX ON "notas" ("estudiante_id");

CREATE INDEX ON "notas" ("grupo_id");

CREATE INDEX ON "notas" ("evaluacion_id");

CREATE INDEX ON "notas_final" ("estudiante_id");

CREATE INDEX ON "notas_final" ("grupo_id");

CREATE INDEX ON "solicitudes" ("estudiante_id");

CREATE INDEX ON "detalles_ubicacion" ("estudiante_id");

CREATE INDEX ON "detalles_ubicacion" ("calificacion_id");

COMMENT ON COLUMN "grupos"."aula_id" IS 'Un grupo se dicta en un aula';

COMMENT ON COLUMN "calificaciones_ubicacion"."ciclo_id" IS 'Nivel al que corresponde la nota';

COMMENT ON COLUMN "detalles_ubicacion"."calificacion_id" IS 'Nivel ubicado';

ALTER TABLE "rol_permisos" ADD FOREIGN KEY ("permiso_id") REFERENCES "permisos" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "escuelas" ADD FOREIGN KEY ("facultad_id") REFERENCES "facultades" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "estudiantes" ADD FOREIGN KEY ("usuario_id") REFERENCES "usuarios" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "estudiantes" ADD FOREIGN KEY ("facultad_id") REFERENCES "facultades" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "estudiantes" ADD FOREIGN KEY ("escuela_id") REFERENCES "escuelas" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "docentes" ADD FOREIGN KEY ("usuario_id") REFERENCES "usuarios" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "ciclos" ADD FOREIGN KEY ("idioma_id") REFERENCES "idiomas" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "ciclos" ADD FOREIGN KEY ("nivel_id") REFERENCES "niveles" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "grupos" ADD FOREIGN KEY ("modulos_id") REFERENCES "modulos" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "grupos" ADD FOREIGN KEY ("ciclo_id") REFERENCES "ciclos" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "grupos" ADD FOREIGN KEY ("docente_id") REFERENCES "docentes" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "grupos" ADD FOREIGN KEY ("aula_id") REFERENCES "aulas" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "evaluaciones" ADD FOREIGN KEY ("periodo_id") REFERENCES "modulos" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "notas" ADD FOREIGN KEY ("estudiante_id") REFERENCES "estudiantes" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "notas" ADD FOREIGN KEY ("grupo_id") REFERENCES "grupos" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "notas" ADD FOREIGN KEY ("evaluacion_id") REFERENCES "evaluaciones" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "notas_final" ADD FOREIGN KEY ("estudiante_id") REFERENCES "estudiantes" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "notas_final" ADD FOREIGN KEY ("grupo_id") REFERENCES "grupos" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "solicitudes" ADD FOREIGN KEY ("estudiante_id") REFERENCES "estudiantes" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "solicitudes" ADD FOREIGN KEY ("tipo_solicitud_id") REFERENCES "tipos_solicitud" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "solicitudes" ADD FOREIGN KEY ("idioma_id") REFERENCES "idiomas" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "solicitudes" ADD FOREIGN KEY ("nivel_id") REFERENCES "niveles" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "solicitudes" ADD FOREIGN KEY ("estado_id") REFERENCES "estados" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "examenes_ubicacion" ADD FOREIGN KEY ("estado_id") REFERENCES "estados" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "examenes_ubicacion" ADD FOREIGN KEY ("idioma_id") REFERENCES "idiomas" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "examenes_ubicacion" ADD FOREIGN KEY ("docente_id") REFERENCES "docentes" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "examenes_ubicacion" ADD FOREIGN KEY ("aula_id") REFERENCES "aulas" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "calificaciones_ubicacion" ADD FOREIGN KEY ("idioma_id") REFERENCES "idiomas" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "calificaciones_ubicacion" ADD FOREIGN KEY ("nivel_id") REFERENCES "niveles" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "calificaciones_ubicacion" ADD FOREIGN KEY ("ciclo_id") REFERENCES "ciclos" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "detalles_ubicacion" ADD FOREIGN KEY ("solicitud_id") REFERENCES "solicitudes" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "detalles_ubicacion" ADD FOREIGN KEY ("idioma_id") REFERENCES "idiomas" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "detalles_ubicacion" ADD FOREIGN KEY ("nivel_id") REFERENCES "niveles" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "detalles_ubicacion" ADD FOREIGN KEY ("examen_id") REFERENCES "examenes_ubicacion" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "detalles_ubicacion" ADD FOREIGN KEY ("estudiante_id") REFERENCES "estudiantes" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "detalles_ubicacion" ADD FOREIGN KEY ("calificacion_id") REFERENCES "calificaciones_ubicacion" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "cronograma_ubicacion" ADD FOREIGN KEY ("modulo_id") REFERENCES "modulos" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "perfil_docente" ADD FOREIGN KEY ("docente_id") REFERENCES "docentes" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "perfil_docente" ADD FOREIGN KEY ("idioma_id") REFERENCES "idiomas" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "documentos_docente" ADD FOREIGN KEY ("perfil_docente_id") REFERENCES "perfil_docente" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "documentos_docente" ADD FOREIGN KEY ("tipo_documento_perfil_id") REFERENCES "tipo_documento_perfil" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "documentos_docente" ADD FOREIGN KEY ("estado_id") REFERENCES "estados" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "puntaje_academico_administrativo" ADD FOREIGN KEY ("academico_administrativo_id") REFERENCES "academico_administrativo" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "cumplimiento_docente" ADD FOREIGN KEY ("modulo_id") REFERENCES "modulos" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "cumplimiento_docente" ADD FOREIGN KEY ("docente_id") REFERENCES "docentes" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "cumplimiento_docente" ADD FOREIGN KEY ("academico_adminstrativo_id") REFERENCES "academico_administrativo" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "encuesta_metricas_docente" ADD FOREIGN KEY ("docente_id") REFERENCES "docentes" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "encuesta_metricas_docente" ADD FOREIGN KEY ("modulo_id") REFERENCES "modulos" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "encuesta_respuestas" ADD FOREIGN KEY ("docente_id") REFERENCES "docentes" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "encuesta_respuestas_detalle" ADD FOREIGN KEY ("respuesta_id") REFERENCES "encuesta_respuestas" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "encuesta_respuestas_detalle" ADD FOREIGN KEY ("pregunta_id") REFERENCES "encuesta_preguntas" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "perfil_docente_resultados" ADD FOREIGN KEY ("perfil_docente_id") REFERENCES "perfil_docente" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "perfil_docente_resultados" ADD FOREIGN KEY ("modulo_id") REFERENCES "modulos" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "perfil_docente_resultados" ADD FOREIGN KEY ("docente_id") REFERENCES "docentes" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "estudiantes" ADD FOREIGN KEY ("usuario_id") REFERENCES "estudiantes" ("img_doc") DEFERRABLE INITIALLY IMMEDIATE;
