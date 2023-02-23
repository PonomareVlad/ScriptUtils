import {serializeError} from "serialize-error";

export default async ({query}, res) => {
    res.setHeader(`Content-Disposition`, `inline; filename="script.js"`)
    res.setHeader(`Content-Type`, `application/javascript; charset=utf-8`)
    try {
        const {source, inject, position} = query
        const scripts = await Promise.all([
            fetch(source).then(response => response.text()),
            fetch(inject).then(response => response.text()),
        ])
        const result = position === "before" ? scripts.reverse() : scripts
        return res.send(result.join(`\r\n`))
    } catch (error) {
        return res.send(`throw Error(${JSON.stringify(serializeError(error))})`)
    }
}
