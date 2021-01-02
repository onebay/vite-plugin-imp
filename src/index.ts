import { Plugin } from 'vite'
import { importServerPluginCreator } from './serverPlugin'
import { importTransformCreator } from './transform'
import { ImpConfig } from './shared'
import chalk from 'chalk'

const optionsCheck = (options: ImpConfig) => {
  if (Array.isArray(options?.libList) && options?.libList?.length) {
    return true
  }
  console.log(chalk.yellow(`libList is required, please check your options!`))
  return false
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
