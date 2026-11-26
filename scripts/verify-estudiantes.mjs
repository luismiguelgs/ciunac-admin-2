import assert from "node:assert/strict"
import { spawn } from "node:child_process"
import { once } from "node:events"
import { mkdir, mkdtemp, writeFile } from "node:fs/promises"
import { createServer } from "node:http"
import { createRequire } from "node:module"
import { join } from "node:path"
import { setTimeout as wait } from "node:timers/promises"

const require = createRequire(import.meta.url)
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright")
const id = "c65ee499-6495-46ee-83c2-17785423fbaf"
const operationId = "ca5ae37f-84e6-4f59-b241-b13b9c29a5ea"
const student = {
    id, nombres: "Ana", apellidos: "Pérez", tipoDocumento: "DNI", numeroDocumento: "00123456",
    email: "ana@example.test", celular: "999000000", fechaNacimiento: "2000-02-29",
    tipoEstudiante: "PRE", genero: "F", codigo: "0012", idQ10: "Q10-TEST",
    facultadId: 3, escuelaId: 8,
    facultad: { id: 3, nombre: "Ingeniería" }, escuela: { id: 8, nombre: "Escuela PRE" },
}

let registrationCalls = 0
let localCreates = 0
let registrationMode = "success"
let detailFailure = false
let listUnauthorized = false
let patchPayload
let q10Payload
let lastQuery
let uploadCalls = 0
let uploadSize = 0
let uploadType
const backend = createServer(async (request, response) => {
    const url = new URL(request.url, "http://fixture")
    const { pathname, searchParams } = url
    const method = request.method
    const reply = (status, body) => {
        response.writeHead(status, { "Content-Type": "application/json", "X-Operation-Id": operationId })
        response.end(body === undefined ? undefined : JSON.stringify(body))
    }
    const read = async () => {
        const chunks = []
        for await (const chunk of request) chunks.push(chunk)
        return Buffer.concat(chunks)
    }
    if (pathname === "/auth/login") {
        const { email } = JSON.parse(await read())
        const permisos = email.startsWith("allow") ? ["gestion_estudiantes"] : ["gestionar_estructura"]
        return reply(200, { access_token: "test-session", user: { id, email, rol: "ADMINISTRATIVO", permisos } })
    }
    if (pathname === "/v1/programas") {
        if (request.headers["api-key"] !== "mock-q10") return reply(401, {})
        return reply(200, [
            { Codigo: "ING-R", Nombre: "Inglés", Numero_resolucion: null },
            { Codigo: "HIDDEN", Nombre: "Inglés Kids", Numero_resolucion: null },
        ])
    }
    if (pathname === "/facultades") return reply(200, [student.facultad])
    if (pathname === "/escuelas") return reply(200, [
        { ...student.escuela, facultadId: 3, tipo: "PRE" },
        { id: 9, nombre: "Escuela POS", facultadId: 3, tipo: "POS" },
    ])
    if (request.headers["x-api-key"] !== "mock-ciunac") return reply(401, {})
    if (pathname === "/estudiantes" && method === "GET") {
        if (listUnauthorized) return reply(401, {})
        lastQuery = Object.fromEntries(searchParams)
        const page = Number(searchParams.get("page") ?? 1)
        const limit = Number(searchParams.get("limit") ?? 25)
        return reply(200, { data: page > 2 ? [] : [student], meta: { page, limit, total: limit + 1, totalPages: 2 } })
    }
    if (pathname === "/estudiantes" && method === "POST") {
        localCreates++
        return reply(500, {})
    }
    if (pathname === "/estudiantes/buscar/00123456") {
        return reply(200, { ...student, usuario: { password: "fixture-private", refreshTokenHash: "fixture-private" } })
    }
    if (pathname === "/estudiantes/buscar/00123457") return reply(200, { ...student, idQ10: null })
    if (pathname.startsWith("/estudiantes/buscar/")) return reply(200)
    if (pathname === `/estudiantes/${id}` && method === "PATCH") {
        patchPayload = JSON.parse(await read())
        Object.assign(student, patchPayload)
        return reply(200, student)
    }
    if (pathname === `/estudiantes/${id}`) return detailFailure ? reply(500, {}) : reply(200, student)
    if (pathname.startsWith("/estudiantes/") && method === "PATCH") return reply(200)
    if (pathname.startsWith("/estudiantes/")) return reply(200)
    if (pathname === "/upload/DNIS") {
        uploadCalls++
        uploadSize = (await read()).length
        uploadType = request.headers["content-type"]
        return reply(201, { success: true, viewLink: "https://example.test/documento", id: "fixture-file" })
    }
    if (pathname === "/q10/estudiantes") {
        registrationCalls++
        q10Payload = JSON.parse(await read())
        if (registrationMode === "network") return response.destroy()
        if (typeof registrationMode === "object") {
            const { status, code } = registrationMode
            return reply(status, { code, message: "fixture", operationId, retryAllowed: false })
        }
        if (registrationMode === "partial") {
            return reply(502, { code: "Q10_CREATED_PROGRAM_PENDING", message: "fixture", operationId,
                estudianteId: id, idQ10: student.idQ10, stage: "PROGRAM_REGISTRATION", retryAllowed: false })
        }
        if (registrationMode === "validation") {
            return reply(400, { code: "Q10_LOCAL_VALIDATION_FAILED", message: "fixture", operationId,
                validationErrors: [{ field: "escuelaId", rules: ["SCHOOL_TYPE_MISMATCH"] }], retryAllowed: false })
        }
        return reply(201, { status: "COMPLETED", estudiante: student, programaRegistrado: true })
    }
    return reply(200, [])
})

async function listen(server) {
    server.listen(0, "127.0.0.1")
    await once(server, "listening")
    return server.address().port
}

const upstream = `http://127.0.0.1:${await listen(backend)}`
const portReservation = createServer()
const port = await listen(portReservation)
await new Promise((resolve) => portReservation.close(resolve))
const origin = `http://localhost:${port}`
await mkdir(".next", { recursive: true })
const buildFolder = (await mkdtemp(join(".next", "estudiantes-test-"))).replaceAll("\\", "/")
const testConfig = `${buildFolder}-tsconfig.json`
await writeFile(testConfig, JSON.stringify({ extends: "../tsconfig.json", compilerOptions: { baseUrl: ".." } }))
const next = spawn(process.execPath, [require.resolve("next/dist/bin/next"), "dev", "--port", String(port)], {
    env: { ...process.env, API_URL: upstream, API_KEY: "mock-ciunac", API_KEY_Q10: "mock-q10", Q10_API_URL: upstream + "/v1",
        NEXT_PUBLIC_API_URL: upstream, AUTH_URL: origin, AUTH_SECRET: "mock-students-secret-with-at-least-32-characters", APP_BASE_URL: origin,
        CIUNAC_NEXT_DIST_DIR: buildFolder, CIUNAC_NEXT_TSCONFIG: testConfig },
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: true,
})
let nextOutput = ""
next.stdout.on("data", (data) => { nextOutput += data })
next.stderr.on("data", (data) => { nextOutput += data })

async function login(context, email) {
    const csrfResponse = await context.request.get(origin + "/api/auth/csrf")
    assert.equal(csrfResponse.status(), 200)
    const { csrfToken } = await csrfResponse.json()
    await context.request.post(origin + "/api/auth/callback/credentials", {
        form: { csrfToken, email, password: "fixture-pass", callbackUrl: origin + "/dashboard" }, maxRedirects: 0,
    })
    const session = await (await context.request.get(origin + "/api/auth/session")).json()
    assert.equal(session.user?.email, email)
}

async function select(page, label, option) {
    await page.getByRole("combobox", { name: label, exact: true }).click()
    await page.getByRole("option", { name: option, exact: true }).click()
}

async function fillRegistration(page, document, documentType, fields = {}) {
    await page.goto(origin + "/estudiantes/nuevo")
    if (documentType) await select(page, "Tipo de documento", documentType)
    await page.getByLabel("Número de documento").fill(document)
    await page.getByRole("button", { name: "Buscar documento" }).click()
    await page.getByText("No se encontró un registro local para este documento.").waitFor()
    for (const [label, value] of Object.entries({
        "Primer nombre": "Ana", "Primer apellido": "Pérez", "Segundo apellido": "López", "Fecha de nacimiento": "2000-02-29",
        "Correo": "ana@example.test", "Teléfono": "011000001", "Celular": "999000000", "Código local": "0009",
        ...fields,
    })) await page.getByLabel(label, { exact: true }).fill(value)
    await select(page, "Género", "Femenino")
    await select(page, "Programa Q10", "Inglés")
}

async function confirmRegistration(page) {
    await page.getByRole("button", { name: "Registrar en Q10" }).click()
    await page.getByRole("alertdialog").waitFor()
    await page.getByRole("button", { name: "Confirmar registro" }).evaluate((button) => {
        button.click()
        button.click()
    })
}

let browser
try {
    for (let attempt = 0; ; attempt++) {
        const response = await fetch(origin + "/api/auth/csrf").catch(() => null)
        if (response?.ok) break
        if (attempt === 100 || next.exitCode !== null) throw new Error("Next.js did not start")
        await wait(200)
    }
    browser = await chromium.launch(process.env.PLAYWRIGHT_CHROMIUM
        ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM }
        : {})
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
    context.setDefaultNavigationTimeout(60000)
    const page = await context.newPage()
    page.setDefaultTimeout(12000)
    const api = origin + "/api/estudiantes"
    assert.equal((await context.request.get(api)).status(), 401)

    const unauthorized = await browser.newContext()
    unauthorized.setDefaultNavigationTimeout(60000)
    await login(unauthorized, "denied@example.test")
    assert.equal((await unauthorized.request.get(api)).status(), 403)
    const deniedPage = await unauthorized.newPage()
    await deniedPage.goto(origin + "/estudiantes")
    assert.match(deniedPage.url(), /dashboard\?error=unauthorized/)
    assert.equal(await deniedPage.locator('a[href="/estudiantes"]').count(), 0)
    await unauthorized.close()

    await login(context, "allowed@example.test")
    assert.equal((await context.request.post(api + "/buscar", { data: { documento: "00123456" } })).status(), 403)
    const requestOptions = { headers: { Origin: origin } }
    const lookup = await context.request.post(api + "/buscar", { ...requestOptions, data: { documento: "00123456" } })
    assert.deepEqual(await lookup.json(), { id, idQ10: "Q10-TEST" })
    const absent = await context.request.get(api + "/e5f70c13-7925-4bd5-b67b-7a76b1affa06")
    assert.equal(await absent.json(), null)
    assert.equal((await context.request.patch(api + "/e5f70c13-7925-4bd5-b67b-7a76b1affa06", {
        ...requestOptions, data: { codigo: "0009" },
    })).status(), 404)
    assert.equal((await context.request.get(api + "?limit=101")).status(), 400)
    listUnauthorized = true
    assert.equal((await context.request.get(api)).status(), 502)
    listUnauthorized = false

    await page.goto(origin + "/estudiantes")
    await page.locator('a[href="/estudiantes"]').waitFor()
    await page.getByText("Página 1 de 2").waitFor()
    await page.getByLabel("Buscar estudiantes").fill("00123")
    await page.waitForURL(/search=00123/)
    await select(page, "Vínculo Q10", "Sin vínculo local")
    await select(page, "Facultad", "Ingeniería")
    await page.getByRole("button", { name: "Página siguiente" }).click()
    await page.getByText("Página 2 de 2").waitFor()
    assert.deepEqual(lastQuery, { search: "00123", vinculadoQ10: "false", facultadId: "3", page: "2" })
    await page.getByRole("link", { name: "Ver detalle" }).click()
    await page.getByText("ana@example.test").waitFor()
    await page.getByRole("link", { name: "Editar datos locales" }).click()
    assert.ok(await page.getByLabel("Número de documento").isDisabled())
    await page.getByLabel("Nombres", { exact: true }).fill(" Érika María ")
    await page.getByLabel("Apellidos", { exact: true }).fill(" De la Cruz Pérez ")
    await page.getByLabel("Celular").fill("999000001")
    await page.getByRole("button", { name: "Guardar" }).click()
    await page.getByText("999000001", { exact: true }).waitFor()
    assert.deepEqual(patchPayload, { nombres: "ÉRIKA MARÍA", apellidos: "DE LA CRUZ PÉREZ", celular: "999000001" })
    await page.getByRole("link", { name: "Regresar" }).click()
    await page.getByText("Página 2 de 2").waitFor()
    assert.match(page.url(), /search=00123/)
    await page.goto(origin + "/estudiantes?page=99")
    await page.waitForURL(/page=2$/)

    const upload = await context.request.post(api + "/documento", {
        ...requestOptions, multipart: { file: { name: "fixture.pdf", mimeType: "application/pdf", buffer: Buffer.alloc(10 * 1024 * 1024) } },
    })
    assert.equal(upload.status(), 201)
    assert.ok(uploadSize > 10 * 1024 * 1024)
    assert.match(uploadType, /multipart\/form-data; boundary=/)

    await page.goto(origin + "/estudiantes/nuevo")
    await page.getByLabel("Número de documento").fill("00123456")
    await page.getByRole("button", { name: "Buscar documento" }).click()
    await page.getByText("El estudiante ya tiene un vínculo Q10 local.", { exact: false }).waitFor()
    assert.ok(await page.getByRole("button", { name: "Registrar en Q10" }).isDisabled())
    await page.getByLabel("Número de documento").fill("00123457")
    await page.getByRole("button", { name: "Buscar documento" }).click()
    const review = page.getByRole("checkbox", { name: "Confirmo que revisé Q10 y puedo continuar con el alta." })
    await review.waitFor()
    assert.ok(await page.getByRole("button", { name: "Registrar en Q10" }).isDisabled())
    await review.check()
    await page.locator('button[form="new-student-form"]:enabled').waitFor()
    assert.equal(registrationCalls, 0)

    await fillRegistration(page, "00999111")
    await select(page, "Tipo de alumno", "Pregrado")
    await select(page, "Escuela", "Escuela PRE")
    await select(page, "Tipo de alumno", "Posgrado")
    assert.match(await page.getByRole("combobox", { name: "Escuela" }).innerText(), /Sin escuela/)
    await select(page, "Escuela", "Escuela POS")
    await page.getByLabel("Documento de identidad (opcional)").setInputFiles({
        name: "fixture.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-fixture"),
    })
    registrationMode = "validation"
    await confirmRegistration(page)
    await page.getByText("La escuela no corresponde al tipo de alumno.").waitFor()
    assert.equal(registrationCalls, 1)
    const savedUploadCalls = uploadCalls
    registrationMode = "success"
    detailFailure = true
    await confirmRegistration(page)
    await page.getByText("No se pudo consultar la ficha local.").waitFor()
    assert.equal(registrationCalls, 2)
    assert.equal(uploadCalls, savedUploadCalls)
    assert.equal(localCreates, 0)
    assert.equal(q10Payload.Fecha_nacimiento, "2000-02-29")
    assert.equal(q10Payload.codigo, "0009")
    assert.equal(q10Payload.Numero_identificacion, "00999111")
    assert.equal(q10Payload.Codigo_tipo_identificacion, "PE01")
    assert.equal(q10Payload.Codigo_programa, "ING-R")
    assert.equal(q10Payload.imgDoc, "https://example.test/documento")
    assert.equal(q10Payload.escuelaId, 9)
    assert.equal(q10Payload.facultadId, 3)
    detailFailure = false
    await page.getByRole("button", { name: "Volver a consultar" }).click()
    await page.getByRole("link", { name: "Ver detalle" }).waitFor()
    assert.equal(registrationCalls, 2)

    const invalidProgram = await context.request.post(api + "/alta", {
        ...requestOptions,
        data: { payload: { ...q10Payload, Codigo_programa: "INGLES" }, verifiedUnlinked: false },
    })
    assert.equal(invalidProgram.status(), 400)
    assert.equal((await invalidProgram.json()).code, "PROGRAM_UNAVAILABLE")
    assert.equal(registrationCalls, 2)

    registrationMode = "partial"
    await fillRegistration(page, "00999333", "Carné de extranjería")
    await confirmRegistration(page)
    await page.getByText("Alta pendiente de revisión").waitFor()
    await page.getByText(`Referencia ${operationId}`).waitFor()
    assert.ok(await page.getByRole("button", { name: "Registrar en Q10" }).isDisabled())
    assert.equal(registrationCalls, 3)
    assert.equal(q10Payload.Codigo_tipo_identificacion, "PE02")
    assert.equal(localCreates, 0)

    registrationMode = "success"
    await fillRegistration(page, "QA-000001", "Pasaporte")
    await confirmRegistration(page)
    await page.getByRole("link", { name: "Ver detalle" }).waitFor()
    assert.equal(registrationCalls, 4)
    assert.equal(q10Payload.Codigo_tipo_identificacion, "PE03")
    assert.equal(q10Payload.Codigo_programa, "ING-R")

    await fillRegistration(page, "12345678", "DNI", {
        "Primer nombre": "Ana", "Segundo nombre (opcional)": "María",
        "Primer apellido": "Pérez", "Segundo apellido": "López",
        "Correo": "ana.prueba@example.com", "Fecha de nacimiento": "2000-01-01",
        "Teléfono": "999888777", "Celular": "999888777", "Dirección (opcional)": "Lima",
        "Código local": "0012345678",
    })
    await select(page, "Tipo de alumno", "PG")
    await page.getByLabel("Documento de identidad (opcional)").setInputFiles({
        name: "dni-prueba.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-fixture"),
    })
    const registrationRequest = page.waitForRequest((request) =>
        request.url() === api + "/alta" && request.method() === "POST",
    )
    await confirmRegistration(page)
    await page.getByRole("link", { name: "Ver detalle" }).waitFor()
    const expectedPayload = {
        Primer_nombre: "ANA", Segundo_nombre: "MARÍA", Primer_apellido: "PÉREZ", Segundo_apellido: "LÓPEZ",
        Email: "ana.prueba@example.com", Codigo_tipo_identificacion: "PE01", Numero_identificacion: "12345678",
        Genero: "F", Fecha_nacimiento: "2000-01-01", Telefono: "999888777", Celular: "999888777",
        Direccion: "Lima", Codigo_programa: "ING-R", tipoEstudiante: "PG", codigo: "0012345678",
        imgDoc: "https://example.test/documento",
    }
    assert.deepEqual((await registrationRequest).postDataJSON(), { payload: expectedPayload, verifiedUnlinked: false })
    assert.deepEqual(q10Payload, expectedPayload)
    assert.equal(registrationCalls, 5)

    for (const [status, code] of [
        [400, "Q10_INVALID_JSON"], [400, "Q10_REQUEST_VALIDATION_FAILED"], [400, "Q10_STUDENT_CREATION_REJECTED"],
        [401, "Q10_UNAUTHORIZED"], [413, "Q10_REQUEST_TOO_LARGE"], [409, "Q10_ID_CONFLICT"], [409, "Q10_ID_ALREADY_LINKED"],
        [502, "Q10_PERIOD_LOOKUP_FAILED"], [502, "Q10_UNAVAILABLE"], [502, "Q10_CREATED_INVALID_RESPONSE"],
        [502, "Q10_CREATED_LOCAL_SYNC_FAILED"], [500, "Q10_INTERNAL_ERROR"],
    ]) {
        registrationMode = { status, code }
        const response = await context.request.post(api + "/alta", { ...requestOptions, data: { payload: q10Payload, verifiedUnlinked: false } })
        assert.equal(response.status(), status)
        const failure = await response.json()
        assert.equal(failure.code, code)
        assert.equal(failure.operationId, operationId)
        assert.equal(failure.retryAllowed, false)
    }
    registrationMode = "network"
    const disconnected = await context.request.post(api + "/alta", { ...requestOptions, data: { payload: q10Payload, verifiedUnlinked: false } })
    assert.equal(disconnected.status(), 502)
    assert.equal((await disconnected.json()).code, "Q10_RESULT_UNCERTAIN")
    assert.equal(registrationCalls, 18)

    const evidence = await mkdtemp(join(".next", "estudiantes-evidence-"))
    await page.goto(origin + "/estudiantes")
    await page.getByText("Página 1 de 2").waitFor()
    await page.screenshot({ path: join(evidence, "estudiantes-escritorio.png") })
    await page.setViewportSize({ width: 390, height: 844 })
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
    await page.screenshot({ path: join(evidence, "estudiantes-movil.png") })
    await page.goto(origin + "/estudiantes/nuevo")
    await page.getByRole("combobox", { name: "Programa Q10" }).waitFor()
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
    await page.screenshot({ path: join(evidence, "estudiantes-alta-movil.png") })
    process.stdout.write(`Pruebas de Estudiantes correctas. Capturas de datos simulados en ${evidence}\n`)
} catch (error) {
    process.stderr.write(nextOutput.slice(-12000))
    throw error
} finally {
    if (browser) await browser.close()
    next.kill()
    backend.close()
}
