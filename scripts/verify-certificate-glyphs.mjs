import assert from "node:assert/strict"
import { resolve } from "node:path"
import { inflateSync } from "node:zlib"
import React from "react"
import { Document, Font, Page, Text, renderToBuffer } from "@react-pdf/renderer"

const fontPath = resolve(process.cwd(), "public/fonts/PinyonScript-Regular.ttf")
const names = [
    "Cuadros Ponce Luz",
    "Enriquez Limahuaya Richard Nixon",
    "Canga Ayala Johnny Omar",
    "Henriquez Limahuaya Richard Nixon",
    "Álvarez Muñoz José",
]
const iterationsPerName = 20

function decodeStream(object) {
    const streamIndex = object.indexOf("stream")
    if (streamIndex < 0) return null

    let start = streamIndex + "stream".length
    if (object[start] === "\r") start += 1
    if (object[start] === "\n") start += 1

    const end = object.indexOf("endstream", start)
    const compressed = Buffer.from(object.slice(start, end).replace(/[\r\n]+$/, ""), "latin1")

    try {
        return inflateSync(compressed).toString("latin1")
    } catch {
        return compressed.toString("latin1")
    }
}

function decodeUnicodeHex(hex) {
    let value = ""
    for (let index = 0; index < hex.length; index += 4) {
        const codePoint = Number.parseInt(hex.slice(index, index + 4), 16)
        if (codePoint) value += String.fromCodePoint(codePoint)
    }
    return value
}

function extractText(buffer) {
    const source = buffer.toString("latin1")
    const streams = [...source.matchAll(/\d+ 0 obj([\s\S]*?)endobj/g)]
        .map(match => decodeStream(match[1]))
        .filter(Boolean)
    const cmap = streams.find(stream => stream.includes("begincmap"))

    assert.ok(cmap, "The generated PDF must contain a Unicode character map")

    const characters = new Map()
    for (const section of cmap.matchAll(/\d+ beginbfchar([\s\S]*?)endbfchar/g)) {
        for (const match of section[1].matchAll(/<([0-9a-f]+)>\s*<([0-9a-f ]*)>/gi)) {
            characters.set(match[1].toUpperCase(), decodeUnicodeHex(match[2].replaceAll(" ", "")))
        }
    }
    for (const range of cmap.matchAll(/<([0-9a-f]{4})>\s*<([0-9a-f]{4})>\s*\[([^\]]+)]/gi)) {
        const start = Number.parseInt(range[1], 16)
        const values = [...range[3].matchAll(/<([0-9a-f ]*)>/gi)]
        values.forEach((match, index) => {
            const cid = (start + index).toString(16).padStart(4, "0").toUpperCase()
            characters.set(cid, decodeUnicodeHex(match[1].replaceAll(" ", "")))
        })
    }

    const text = []
    for (const stream of streams.filter(item => item.includes(" TJ"))) {
        for (const block of stream.matchAll(/\[([\s\S]*?)]\s*TJ/g)) {
            for (const encoded of block[1].matchAll(/<([0-9a-f]+)>/gi)) {
                for (let index = 0; index < encoded[1].length; index += 4) {
                    const cid = encoded[1].slice(index, index + 4).toUpperCase()
                    text.push(characters.get(cid) ?? "")
                }
            }
        }
    }

    return text.join("")
}

for (const [index, name] of names.entries()) {
    const family = `CertificateGlyphRegression${index}`
    Font.register({ family, src: fontPath })

    const source = Font.getFont({ fontFamily: family })
    await source.load()

    const firstCodePoint = name.codePointAt(0)
    const glyphId = source.data._cmapProcessor.lookup(firstCodePoint)
    const cachedGlyph = source.data.getGlyph(glyphId)
    assert.deepEqual(cachedGlyph.codePoints, [], "The regression setup must prime an empty glyph mapping")

    for (let iteration = 0; iteration < iterationsPerName; iteration += 1) {
        const document = React.createElement(
            Document,
            null,
            React.createElement(
                Page,
                { size: "A4" },
                React.createElement(Text, { style: { fontFamily: family, fontSize: 24 } }, name),
            ),
        )
        const buffer = await renderToBuffer(document)

        assert.equal(
            extractText(buffer),
            name,
            `The generated PDF lost characters from ${name} on iteration ${iteration + 1}`,
        )
    }
}

console.log(
    `Certificate glyph regression passed for ${names.length * iterationsPerName} generated PDFs.`,
)
