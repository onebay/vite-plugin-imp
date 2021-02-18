import * as parser from '@babel/parser'
import generate from "@babel/generator"
import chalk from 'chalk'
import { paramCase } from 'param-case'

export interface libItem {
  // library name
  libName: string
  // component style file path
  style: (name: string) => string | string[] | boolean
  // default `es`
  libDirectory?: string
  camel2DashComponentName?: boolean
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

const isArray = Array.isArray
const isString = (str: unknown) => (typeof str === 'string')

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
  /* istanbul ignore else */
  if (isArray(astBody)) {
    astBody.forEach((astNode, index) => {
      const libName = (astNode as AstNode)?.source?.value || ''
      const matchLib = libList.find(lib => lib.libName === libName)
      /* istanbul ignore else */
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

export const stylePathHandler = (stylePath: string | string[] | boolean) => {
  // for some case: when the component does not have a style file to import
  let str = ''
  if (isString(stylePath) && stylePath) {
    str += `import '${stylePath}'\n`
  } else if (isArray(stylePath)) {
    stylePath.forEach(item => {
      str += `import '${item}'\n`
    })
  }
  return str
}

export const addImportToCode = (code: string, impConfig: ImpConfig, removeoldImport = false) => {

  const { importMaps, codeRemoveOriginImport } = parseImportModule(code, impConfig.libList)

  let importStr = ''

  impConfig.libList.forEach(({libName, style, camel2DashComponentName = true}) => {
    if (importMaps[libName]) {
      importMaps[libName].forEach(item => {
        if (camel2DashComponentName) {
          item = paramCase(item)
        }
        let stylePath = style(item)
        const styleImportString = stylePathHandler(stylePath)
        importStr += styleImportString
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
