import * as parser from '@babel/parser'
import generate from "@babel/generator"
import chalk from 'chalk'
import { paramCase } from 'param-case'
import { ResolvedConfig } from 'vite'
import { ImpConfig, ImportMaps } from './types'
import * as path from 'path'
import * as fs from 'fs'

function getType(obj: any) {
  return Object.prototype.toString.call(obj).slice(8, -1);
}

const identity = <T>(v: T) => v
const isArray = Array.isArray
const isString = (obj: unknown): obj is string => (typeof obj === 'string')
const isBoolean = (obj: unknown): obj is boolean => (typeof obj === 'boolean')
const isRegExp = (obj: unknown): obj is RegExp => getType(obj) === 'RegExp'

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
  astBody.forEach((astNode, index) => {
    if (astNode.type !== 'ImportDeclaration') {
      return
    }
    const libName = astNode.source.value
    const matchLib = libList.find((lib) => lib.libName === libName)
    if (!matchLib) {
      return
    }
    if (astNode.specifiers.length === 0) {
      warn(`Can't transform ${generate(astNode).code}`)
      return
    }
    const {
      camel2DashComponentName = true,
      libDirectory = 'es',
      replaceOldImport = command === 'build',
      nameFormatter = identity,
    } = matchLib
    astNode.specifiers.forEach((item) => {
      if (item.type === "ImportNamespaceSpecifier") {
        warn(`Can't transform ${generate(astNode).code}`)
        return
      }
      const name =
        item.type === "ImportDefaultSpecifier"
          ? "default"
          : item.imported.type === "Identifier"
          ? item.imported.name
          : item.imported.value
      const localName = item.local.name
      const libDir = libDirectory ? `${libDirectory}/` : ""
      if (replaceOldImport) {
        const finalName = nameFormatter(
          camel2DashComponentName ? paramCase(name) : name,
          name
        )
        newImportStatement += `import ${localName} from '${libName}/${libDir}${finalName}';`
        toBeRemoveIndex.push(index)
      }
      if (importMaps[libName]) {
        importMaps[libName].push(name)
      } else {
        importMaps[libName] = [name]
      }
    })
  })

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

const stylePathNotFoundHandler = (stylePath: string, ignoreStylePathNotFound: boolean) => {
  if (ignoreStylePathNotFound) {
    let stylePathExists = true
    try {
      // require is used to detect the existence of style files
      require(stylePath)
    } catch (error: any) {
      stylePathExists = error?.code !== 'MODULE_NOT_FOUND'
    }
    
    /**
     * solve a situation
     * when stylePath like 'vant/es/button/style', it can't be require(), 
     * but can be import, because 'vant/es/button/style/index.js' or 
     * 'vant/es/button/style/index.mjs' (in vant v3.5.0) is exists.
     */
    if (!stylePathExists) {
      const fullStylePath = path.resolve(process.cwd(), 'node_modules', stylePath)
      const lastPath = fullStylePath.split('/').pop()
      if (!lastPath?.includes('.')) {
        const possibleEndWithsPaths = [
          'index.js',
          'index.mjs',
          '.js',
          '.mjs'
        ];
        if(possibleEndWithsPaths.some(p => fs.existsSync(path.resolve(fullStylePath, p)))) {
          stylePathExists = true
        }
      }
    }
    
    if (stylePathExists) {
      return `import '${stylePath}';`
    } else {
      warn(`${stylePath} is not found!`)
      warn('If you think this is a bug, feel free to open an issue on https://github.com/onebay/vite-plugin-imp/issues')
      return ''
    }
  }
  return `import '${stylePath}';`
}

export const stylePathHandler = (stylePath: string | string[] | boolean, ignoreStylePathNotFound: boolean = true) => {
  // for some case: when the component does not have a style file to import
  let str = ''
  if (isString(stylePath) && stylePath) {
    str += stylePathNotFoundHandler(stylePath as string, ignoreStylePathNotFound)
  } else if (isArray(stylePath)) {
    stylePath.forEach((item) => {
      str += stylePathNotFoundHandler(item, ignoreStylePathNotFound)
    })
  }
  return str
}

export const addImportToCode = (
  code: string, 
  impConfig: ImpConfig, 
  command: ResolvedConfig['command'],
  ignoreStylePathNotFound?: boolean
) => {

  const { importMaps, codeRemoveOriginImport } = parseImportModule(code, impConfig.libList, command)

  let importStr = ''

  impConfig.libList.forEach(({ libName, style = () => false, camel2DashComponentName = true }) => {
    if (importMaps[libName]) {
      importMaps[libName].forEach(item => {
        if (camel2DashComponentName) {
          item = paramCase(item)
        }
        let stylePath = style(item)
        const styleImportString = stylePathHandler(stylePath, ignoreStylePathNotFound)
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
export const warn = (...args: any[]) => {
  args[0] = `${chalk.yellow('[vite-plugin-imp]')} ${args[0]}`
  console.log(...args)
}


export const isTranspileDependencies = (transpileDependencies: ImpConfig['transpileDependencies'], id: string) => {
  if(isBoolean(transpileDependencies)) return transpileDependencies;
  if(isArray(transpileDependencies)) {
    for (const item of transpileDependencies) {
      if (isString(item) && id.includes(item) || isRegExp(item) && item.test(id)) {
        return true
      }
    }
  }
  return false
}