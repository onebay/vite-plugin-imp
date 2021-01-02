import { Transform } from 'vite'
import { ImpConfig, addImportToCode, codeIncludesLibraryName } from './shared'

export const importTransformCreator = ({ libList = [] }: ImpConfig) => {

  const importTransform: Transform = {
    test({ isBuild, isImport }) {
      return isBuild && isImport
    },
    transform: ({ code }) => {
      let result = code
      if (codeIncludesLibraryName(code, libList)) {
        result = addImportToCode(code, libList)
      }
      return result
    }
  }
  return importTransform
}
