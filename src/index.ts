import { Plugin } from 'vite'
import { importServerPluginCreator } from './serverPlugin'
import { importTransformCreator } from './transform'
import { ImpConfig } from './shared'
import chalk from 'chalk'

const optionsCheck = (options: ImpConfig) => {
  if (!options?.libList) {
    console.log(chalk.yellow(`libList is is required, please check your options: ${options}`))
    return false
  }
  return true
}

const pluginCreator = (options: ImpConfig) => {
  if (!optionsCheck(options)) {
    return {}
  }
  const plugin: Plugin = {
    configureServer: importServerPluginCreator(options),
    transforms: [importTransformCreator(options)]
  }
  return plugin
}

export = pluginCreator
