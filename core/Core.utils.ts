import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const basePath = __dirname + '/..'

const apiTemplate = <T>(code = 403, message = 'Invalid Request', data: T | Record<string | number | symbol, never> = {}, version = 'v1'): {
    code: number; message: string; data: T; version: string
} => ({
    code,
    message,
    data,
    version
})


const ArrayFill = (start: number, count: number): number[] => {
    const tmpArray = []
    const end = start + count
    for (; start <= end; start++) {
        tmpArray.push(start)
    }
    return tmpArray
}

const htmlspecialchars = (str: string) => {
    str = str.replaceAll('&gt;', '>').replaceAll('&lt;', '<').replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll('&#039;', "'")
    str = str.replaceAll(/&#([\d]+);/gm, (_, p1) => String.fromCharCode(parseInt(p1)))
    return str
}

export {basePath, apiTemplate, ArrayFill, htmlspecialchars}