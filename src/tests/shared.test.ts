import { 
  stylePathHandler,
  parseImportModule,
  addImportToCode,
  codeIncludesLibraryName,
  isTranspileDependencies
} from '../shared'

describe('Test parseImportModule', () => {
  const code = `import { Button } from 'onebay'`
  it ('import onebay Button & tree shaking', () => {
    const { importMaps, codeRemoveOriginImport } = parseImportModule(code, [
      {
        libName: 'onebay',
        style(name) {
          return `onebay/es/${name}/index.css`
        }
      }
    ], 'build')
    expect(codeRemoveOriginImport.indexOf(`import Button from 'onebay/es/button'`) >= 0).toBeTruthy()
    expect(importMaps.onebay.includes('Button')).toBeTruthy()
  })

  it ('import onebay Button & tree shaking libDirectory == ""', () => {
    const { importMaps, codeRemoveOriginImport } = parseImportModule(code, [
      {
        libName: 'onebay',
        libDirectory: '',
        style(name) {
          return `onebay/es/${name}/index.css`
        }
      }
    ], 'build')
    expect(codeRemoveOriginImport.indexOf(`import Button from 'onebay/button'`) >= 0).toBeTruthy()
    expect(importMaps.onebay.includes('Button')).toBeTruthy()
  })

  it ('import onebay Button & replaceOldImport = false', () => {
    const { importMaps, codeRemoveOriginImport } = parseImportModule(code, [
      {
        libName: 'onebay',
        style(name) {
          return `onebay/es/${name}/index.css`
        },
        replaceOldImport: false
      }
    ], 'build')
    
    expect(codeRemoveOriginImport.indexOf(code) >= 0).toBeTruthy()
    expect(importMaps.onebay.includes('Button')).toBeTruthy()
  })
})

describe('Test style function', () => {
  it ('stylePath is string', () => {
    const testPath = 'onebay/es/button/index.css'
    const result = stylePathHandler(testPath, false)
    const isEqual = result === `import '${testPath}';`
    expect(isEqual).toBeTruthy()
  })

  it ('stylePath is false', () => {
    const testPath = false
    const result = stylePathHandler(testPath, false)
    const isEqual = result === ''
    expect(isEqual).toBeTruthy()
  })

  it ('stylePath is string[]', () => {
    const testPath = [
      'onebay/es/button/index.css',
      'onebay/es/modal/index.css'
    ]
    const result = stylePathHandler(testPath, false)
    const p0 = `import '${testPath[0]}';`
    const p1 = `import '${testPath[1]}';`
    expect(result.indexOf(p0) > -1).toBeTruthy()
    expect(result.indexOf(p1) > -1).toBeTruthy()
  })
})

describe('Test addImportToCode', () => {
  it ('', () => {
    const code = `
      import { Button, Modal } from 'onebay' 
    `
    const result = addImportToCode(code, {
      libList: [
        {
          libName: 'onebay',
          style(name) {
            return `onebay/es/${name}/index.css`
          }
        }
      ]
    }, 'serve', false)
    expect(result.indexOf(`import 'onebay/es/button/index.css';`) >= 0).toBeTruthy()
    expect(result.indexOf(`import 'onebay/es/modal/index.css';`) >= 0).toBeTruthy()
  })
})

describe('Test codeIncludesLibraryName', () => {
  it ('The code include libName', () => {
    const code = `
      import { Button, Modal } from 'onebay' 
    `
    const result = codeIncludesLibraryName(code, [
      {
        libName: 'onebay',
        style(name) {
          return `onebay/es/${name}/index.css`
        }
      }
    ])
    expect(result).toBeTruthy()
  })

  it ('the code do not include libName', () => {
    const code = `
      import { Button, Modal } from 'onebay' 
    `
    const result = codeIncludesLibraryName(code, [
      {
        libName: 'antd',
        style(name) {
          return `antd/es/${name}/index.css`
        }
      }
    ])
    expect(result).toBeFalsy()
  })
})

describe('Test isTranspileDependencies', () => {
  const id = 'node_modules/third-party-lib'
  it ('transpileDependencies = true', () => {
    const result = isTranspileDependencies(true, id)
    expect(result).toBeTruthy()
  })

  it ('transpileDependencies = false', () => {
    const result = isTranspileDependencies(false, id)
    expect(result).toBeFalsy()
  })

  it ('transpileDependencies = ["third-party-lib"]', () => {
    const result = isTranspileDependencies(['third-party-lib'], id)
    expect(result).toBeTruthy()
  })

  it ('transpileDependencies = [/third-party-lib/]', () => {
    const result = isTranspileDependencies([/third-party-lib/], id)
    expect(result).toBeTruthy()
  })

  it ('transpileDependencies = ["onebay-ui"]', () => {
    const result = isTranspileDependencies(['onebay-ui'], id)
    expect(result).toBeFalsy()
  })

  it ('transpileDependencies = [/onebay-ui/]', () => {
    const result = isTranspileDependencies([/onebay-ui/], id)
    expect(result).toBeFalsy()
  })

  it (`transpileDependencies = [/onebay-ui/, 'third-party-lib']`, () => {
    const result = isTranspileDependencies([/onebay-ui/, 'third-party-lib'], id)
    expect(result).toBeTruthy()
  })

  it (`transpileDependencies = [/onebay-ui/, 'third-party-lib']`, () => {
    const result = isTranspileDependencies(['onebay-ui', /third-party-lib/], id)
    expect(result).toBeTruthy()
  })

})
