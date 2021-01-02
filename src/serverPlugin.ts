import { streamToString, addImportToCode, ImpConfig, codeIncludesLibraryName } from './shared'
import { ServerPlugin } from 'vite/dist/node/index'

const fileTypes = ['vue', 'ts', 'tsx', 'js', 'jsx']

export const importServerPluginCreator = ({ libList = [] }: ImpConfig) => {
  const importServerPlugin: ServerPlugin = ({ app }) => {
    app.use(async (ctx, next) => {
      const splitPaths = ctx.path.split('.')
      // ...wait for vite to do built-in transforms
      await next()
  
      // Post processing before the content is served. Note this includes parts
      // compiled from `*.vue` files, where <template> and <script> are served as
      // `application/javascript` and <style> are served as `text/css`.
  
      if (ctx.response.is('js') && fileTypes.includes(splitPaths[splitPaths.length - 1]) && ctx.path === ctx.url) {
        let code = ctx.body
        if (ctx.body && ctx.body['readable']) {
          code = await streamToString(ctx.body)
        }
        let result = code
        if (codeIncludesLibraryName(code, libList)) {
          result = addImportToCode(code, libList)
        }
  
        ctx.body = result
      }
    })
  }

  return importServerPlugin
}