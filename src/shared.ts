import * as parser from '@babel/parser'
import generate from "@babel/generator"
import chalk from 'chalk'
import { paramCase } from 'param-case'
import { ResolvedConfig } from 'vite'

export interface LibItem {
  /**
   * library name
   */
  libName: string
  /**
   * component style file path
   */
  style?: (name: string) => string | string[] | boolean
  /**
   * default `es`
   */
  libDirectory?: string
  /**
   * whether convert component name from camel to dash, default `true`
   */
  camel2DashComponentName?: boolean
  /**
   * whether replace old import statement, default `command === 'build'`,
   * that means in vite serve default to `false`, in vite build default to `ture`
   */
  replaceOldImport?: boolean
  /**
   * imported name formatter
   */
  nameFormatter?: (name: string, importedName: string) => string
}

export interface ImpConfig {
  optimize?: boolean
  libList: LibItem[]
  /**
   * exclude the library from defaultLibList
   */
  exclude?: string[]
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

export function parseImportModule (
  code: string, 
  libList: ImpConfig['libList'], 
  command: ResolvedConfig['command']
) {
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
        const { camel2DashComponentName = true, libDirectory = 'es', replaceOldImport = command === 'build' } = matchLib
        astNode.specifiers.forEach((item) => {
          const name = (item as Specifiers)?.imported.name
          const localName = (item as Specifiers)?.local.name
          if(!name) {
            return
          }
          const libDir = libDirectory ? `${libDirectory}/` : ''
          if (replaceOldImport) {
            let finalName = camel2DashComponentName ? paramCase(name) : name
            if (matchLib.nameFormatter) {
              finalName = matchLib?.nameFormatter?.(finalName, name)
            }
            newImportStatement += `import ${localName} from '${libName}/${libDir}${finalName}';`
            toBeRemoveIndex.push(index)
          }
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
  codeRemoveOriginImport = `${newImportStatement} ; ${codeRemoveOriginImport}`

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
    str += `import '${stylePath}';`
  } else if (isArray(stylePath)) {
    stylePath.forEach(item => {
      str += `import '${item}';`
    })
  }
  return str
}

export const addImportToCode = (
  code: string, 
  impConfig: ImpConfig, 
  command: ResolvedConfig['command'] = 'serve'
) => {

  const { importMaps, codeRemoveOriginImport } = parseImportModule(code, impConfig.libList, command)

  let importStr = ''

  impConfig.libList.forEach(({libName, style = () => false, camel2DashComponentName = true}) => {
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

  return `${importStr}${codeRemoveOriginImport}`
}

export const log = (...args: any[]) => {
  args[0] = `${chalk.green('[vite-plugin-imp]')} ${args[0]}`
  console.log(...args)
}
