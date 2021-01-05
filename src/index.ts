import { Plugin } from 'vite'
import { ImpConfig, log, addImportToCode, codeIncludesLibraryName } from './shared'
import chalk from 'chalk'

const optionsCheck = (options: ImpConfig) => {
  if (Array.isArray(options?.libList) && options?.libList?.length) {
    return true
  }
  log(chalk.yellow(`libList is required, please check your options!`))
  return false
}

export default function vitePluginImp(config: ImpConfig): Plugin {
  const name = 'vite-plugin-imp'
  if (!optionsCheck(config)) {
    return { name }
  }
  return {
    name,
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
