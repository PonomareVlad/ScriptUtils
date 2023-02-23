import {serializeError} from "serialize-error";

export default async ({query}, res) => {
    res.setHeader(`Content-Disposition`, `inline; filename="script.js"`)
    res.setHeader(`Content-Type`, `application/javascript; charset=utf-8`)
    try {
        const {source, vars} = query
        const script = await fetch(source).then(response => response.text())
        const globalizers = vars.split(",").map(v => `globalThis["${v}"] = ${v};`)
        return res.send([script, ...globalizers].join(`\r\n`))
    } catch (error) {
        return res.send(`throw Error(${JSON.stringify(serializeError(error))})`)
    }
}
