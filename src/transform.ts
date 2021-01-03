import { Transform } from 'vite'
import { ImpConfig, addImportToCode, codeIncludesLibraryName } from './shared'

export const importTransformCreator = (impConfig: ImpConfig) => {

  const importTransform: Transform = {
    test({ isBuild, isImport }) {
      return isBuild && isImport
    },
    transform: ({ code }) => {
      let result = code
      if (codeIncludesLibraryName(code, impConfig.libList)) {
        result = addImportToCode(code, impConfig)
      }
      return result
    }
  }
  return importTransform
}
