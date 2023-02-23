import {serializeError} from "serialize-error";

export default async ({query}, {send}) => {
    try {
        const {source, inject, position} = query
        const scripts = await Promise.all([
            fetch(source).then(response => response.text()),
            fetch(inject).then(response => response.text()),
        ])
        const result = position === "before" ? scripts.reverse() : scripts
        return send(result.join(`\r\n`))
    } catch (error) {
        return send(`throw Error(${JSON.stringify(serializeError(error))})`)
    }
}
