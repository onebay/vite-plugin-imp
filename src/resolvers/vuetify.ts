import { LibResolver } from '../types'

export const VuetifyResolver: LibResolver = {
  libName: 'vuetify',
  libDirectory: 'lib/components',
  replaceOldImport: true,
  style: () => false,
  camel2DashComponentName: false
}
