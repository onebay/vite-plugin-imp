import { stylePathHandler, parseImportModule, addImportToCode, codeIncludesLibraryName } from '../shared'

describe('Test parseImportModule', () => {
  const code = `
    import { Button } from 'onebay' 
  `
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
})

describe('Test style function', () => {
  it ('stylePath is string', () => {
    const testPath = 'onebay/es/button/index.css'
    const result = stylePathHandler(testPath)
    const isEqual = result === `import '${testPath}'\n`
    expect(isEqual).toBeTruthy()
  })

  it ('stylePath is false', () => {
    const testPath = false
    const result = stylePathHandler(testPath)
    const isEqual = result === ''
    expect(isEqual).toBeTruthy()
  })

  it ('stylePath is string[]', () => {
    const testPath = [
      'onebay/es/button/index.css',
      'onebay/es/modal/index.css'
    ]
    const result = stylePathHandler(testPath)
    const p0 = `import '${testPath[0]}'\n`
    const p1 = `import '${testPath[1]}'\n`
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
    })
    
    expect(result.indexOf(`import 'onebay/es/button/index.css'\n`) >= 0).toBeTruthy()
    expect(result.indexOf(`import 'onebay/es/modal/index.css'\n`) >= 0).toBeTruthy()
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

