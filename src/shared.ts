import * as parser from "@babel/parser"
import { transformSync } from '@babel/core'
import { Stream } from "stream"

export function streamToString (stream: Stream) {
  const chunks: Uint8Array[] = []
  return new Promise((resolve, reject) => {
    stream.on('data', chunk => chunks.push(chunk))
    stream.on('error', reject)
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
  })
}

export interface libItem {
  libName: string
  style: (name: string) => string
}

export interface ImpConfig {
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
}

export function parseImportModule (code: string, libNames: string[]) {
  const ast = parser.parse(code, {
    sourceType: "module",
  
    plugins: [
      // enable jsx and flow syntax
      "jsx"
    ]
  });
  
  const astBody = ast.program.body
  
  const importMaps: ImportMaps = {}
  
  if (Array.isArray(astBody)) {
    astBody.forEach((astNode) => {
      const libName = (astNode as AstNode)?.source?.value || ''
      if (astNode.type === 'ImportDeclaration' && libNames.includes(libName as string)) {
        astNode.specifiers.forEach((item) => {
          const name = (item as Specifiers)?.imported.name
          if(!name) {
            return
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

  return importMaps;
}

export const transform = (code: string) => transformSync(code, {
  presets: [
    [
      "@babel/preset-env",
      {
        "modules": false
      }
    ]
  ]
})

export const codeIncludesLibraryName = (code: string, libList: ImpConfig['libList']) => {
  return !libList.every(({ libName }) => {
    return !new RegExp(`('${libName}')|("${libName}")`).test(code);
  });
}

export const addImportToCode = (code: string, libList: ImpConfig['libList']) => {
  const transformResult = transform(code)
  const transformCode = transformResult?.code || code

  const libNames = libList.map(item => item.libName)
  const importMaps = parseImportModule(transformCode, libNames)
  
  let importStr = ''

  libList.forEach(({libName, style}) => {
    if (importMaps[libName]) {
      importMaps[libName].forEach(item => {
        importStr += `import '${style(item.toLowerCase())}'\n`
      })
    }
  })

  return `${importStr}${transformCode}`
} 