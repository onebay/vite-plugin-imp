import { Plugin } from 'vite'
import { ImpConfig, addImportToCode, codeIncludesLibraryName } from './shared'

export default function vitePluginImp(config: ImpConfig): Plugin {

  return {
    name: 'vite-plugin-imp',
    transform(code, id) {
      if (!/(node_modules)/.test(id) && codeIncludesLibraryName(code, config.libList)) {
        return {
          code: addImportToCode(code, config),
          map: null
        }
      }
      return code
    }
  }
}