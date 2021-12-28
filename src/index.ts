import { Plugin, ResolvedConfig } from 'vite'
import { log, addImportToCode, codeIncludesLibraryName } from './shared'
import chalk from 'chalk'
import defaultLibList from './resolvers'
import * as path from 'path'
import * as fs from 'fs'
import { ImpConfig } from './types'


const optionsCheck = (options: Partial<ImpConfig>) => {
  if (options?.libList && !Array.isArray(options?.libList)) {
    log(chalk.yellow(`libList is Array, please check your options!`))
    return false
  }
  return true
}

export default function vitePluginImp(userConfig: Partial<ImpConfig> = {}): Plugin {
  let viteConfig: ResolvedConfig
  let config: ImpConfig
  let isSourcemap = false
  const name = 'vite-plugin-imp'
  if (!optionsCheck(userConfig)) {
    return { name }
  }
  
  return {
    name,
    configResolved(resolvedConfig) {
      // store the resolved config
      viteConfig = resolvedConfig
      isSourcemap = !!viteConfig.build?.sourcemap
      config = Object.assign({ 
        libList: [], 
        exclude: [], 
        ignoreStylePathNotFound: viteConfig.command === 'serve'
      }, userConfig)
    
      const libListNameSet: Set<string> = new Set(config.libList.map(lib => lib.libName))
      // filter defaultLibList from exclude
      let defaultLibFilteredList = defaultLibList.filter(lib => !config.exclude?.includes(lib.libName))

      // check user package.json to filter LibList from user dependencies
      const userPkgPath = path.resolve(viteConfig.root, 'package.json')
      if (fs.existsSync(userPkgPath)) {
        const userPkg = require(userPkgPath)
        if (userPkg?.dependencies) {
          defaultLibFilteredList = defaultLibFilteredList.filter(item => userPkg?.dependencies?.[item.libName])
        }
      }

      // merge defaultLibFilteredList to config.libList
      defaultLibFilteredList.forEach(defaultLib => {
        if (!libListNameSet.has(defaultLib.libName)) {
          config.libList?.push(defaultLib)
          libListNameSet.add(defaultLib.libName)
        }
      })
    },
    transform(code, id) {
      if (!/(node_modules)/.test(id) && codeIncludesLibraryName(code, config.libList)) {
        const sourcemap = this?.getCombinedSourcemap()
        return {
          code: addImportToCode(code, config, viteConfig.command, viteConfig.root, config.ignoreStylePathNotFound),
          map: isSourcemap ? sourcemap : null
        }
      }
      return {
        code,
        map: null
      }
    }
  }
}
