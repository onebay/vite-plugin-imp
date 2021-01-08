import * as parser from '@babel/parser'
import { Stream } from "stream"
import generate from "@babel/generator"
import chalk from 'chalk'
import { paramCase } from 'param-case'

export function streamToString (stream: Stream) {
  const chunks: Uint8Array[] = []
  return new Promise((resolve, reject) => {
    stream.on('data', chunk => chunks.push(chunk))
    stream.on('error', reject)
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
  })
}

export interface libItem {
  // library name
  libName: string
  // component style file path
  style: (name: string) => string
  // default `es`
  libDirectory?: string
}

export interface ImpConfig {
  optimize?: boolean
  libList: libItem[]
}

export interface ImportMaps {
  [key: string]: string[]
}

type AstNode = {
  source: {
    value?:string
  }
}

type Specifiers = {
  imported: {
    name?: string
  }
  local: {
    name?: string
  }
}

export function parseImportModule (code: string, libList: ImpConfig['libList']) {
  const ast = parser.parse(code, {
    sourceType: "module",

    plugins: [
      // enable jsx and flow syntax
      "jsx"
    ]
  });

  const astBody = ast.program.body

  const importMaps: ImportMaps = {}
  const toBeRemoveIndex: number[] = []
  let newImportStatement = ''
  if (Array.isArray(astBody)) {
    astBody.forEach((astNode, index) => {
      const libName = (astNode as AstNode)?.source?.value || ''
      const matchLib = libList.find(lib => lib.libName === libName)
      if (astNode.type === 'ImportDeclaration' && matchLib) {
        astNode.specifiers.forEach((item) => {
          const name = (item as Specifiers)?.imported.name
          const localName = (item as Specifiers)?.local.name
          if(!name) {
            return
          }
          const libDirectory = matchLib?.libDirectory || 'es'
          newImportStatement += `import ${localName} from '${libName}/${libDirectory}/${paramCase(name)}'\n`
          toBeRemoveIndex.push(index)
          if (importMaps[libName]) {
            importMaps[libName].push(name)
          } else {
            importMaps[libName] = [name]
          }
        })
      }
    })
  }

  ast.program.body = astBody.filter((item, index) => !toBeRemoveIndex.includes(index))

  let codeRemoveOriginImport = generate(ast).code
  codeRemoveOriginImport = `${newImportStatement} \n ${codeRemoveOriginImport}`
  return { importMaps, codeRemoveOriginImport }
}

export const codeIncludesLibraryName = (code: string, libList: ImpConfig['libList']) => {
  return !libList.every(({ libName }) => {
    return !new RegExp(`('${libName}')|("${libName}")`).test(code);
  });
}

export const addImportToCode = (code: string, impConfig: ImpConfig, removeoldImport = false) => {

  const { importMaps, codeRemoveOriginImport } = parseImportModule(code, impConfig.libList)

  let importStr = ''

  impConfig.libList.forEach(({libName, style}) => {
    if (importMaps[libName]) {
      importMaps[libName].forEach(item => {
        if (libName == "element-plus"){
          item = paramCase(item)
        }
        importStr += `import '${style(item.toLowerCase())}'\n`
      })
    }
  })
  if (removeoldImport) {
    return `${importStr}${codeRemoveOriginImport}`
  }
  return `${importStr}${code}`
}

export const log = (...args: any[]) => {
  args[0] = `${chalk.green('[vite-plugin-imp]')} ${args[0]}`
  console.log(...args)
}
