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

export {basePath, apiTemplate, ArrayFill}