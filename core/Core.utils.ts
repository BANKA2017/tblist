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

const convertURIToUTF8 = (str: string, encode = 'gbk') => {
    const matchCode = [...str.matchAll(/%[\da-fA-F]{2}/gm)]
    const tmpUint8Array = []
    if (matchCode.length === 0) {
        return str
    } else if (matchCode.length > 0 && (matchCode[0].index || -1) > 0) {
        for (let i = 0; i < (matchCode[0].index || -1); i++) {
            tmpUint8Array.push(str.charCodeAt(i))
        }
    }
    for (const codeIndex in matchCode) {
        const index = Number(codeIndex)
        const code = matchCode[codeIndex]
        tmpUint8Array.push(parseInt(code[0].slice(1), 16))
        
        let nextIndex = str.length
        if (index < matchCode.length - 1) {
            nextIndex = matchCode[index + 1].index || -1
        }
        for (let i = code.index + 3; i < nextIndex; i++) {
            tmpUint8Array.push(str.charCodeAt(i))
        }
    }
    
    return new TextDecoder(encode).decode(new Uint8Array(tmpUint8Array))
}

export {basePath, apiTemplate, ArrayFill, htmlspecialchars, convertURIToUTF8}