export interface LibItem {
  /**
   * library name
   */
  libName: string
  /**
   * component style file path
   */
  style?: (name: string) => string | string[] | boolean
  /**
   * default `es`
   */
  libDirectory?: string
  /**
   * whether convert component name from camel to dash, default `true`
   */
  camel2DashComponentName?: boolean
  /**
   * whether replace old import statement, default `command === 'build'`,
   * that means in vite serve default to `false`, in vite build default to `ture`
   */
  replaceOldImport?: boolean
  /**
   * imported name formatter
   */
  nameFormatter?: (name: string, importedName: string) => string
}

export interface LibResolverObject extends LibItem {}

export type LibResolver = LibResolverObject

export interface ImpConfig {
  optimize?: boolean
  libList: LibResolver[]
  /**
   * exclude the library from defaultLibList
   */
  exclude?: string[]
  /**
   * when a style path is not found, don’t show error and give a warning. default `command === 'serve'`
   */
  ignoreStylePathNotFound?: boolean
}

export interface ImportMaps {
  [key: string]: string[]
}