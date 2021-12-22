import { LibItem } from '../shared'
import { AntdMobileReactResolver } from './antd-mobile'
import { AntdResolver } from './antd'
import { AntDesignVueResolver } from './antdv'
import { ArcoDesignReactResolver } from './arco-design-react'
import { ElementPlusResolver } from './element-plus'
import { ElementUIResolver } from './element-ui'
import { LodashResolver } from './lodash'
import { UnderScoreResolver } from './underscore'
import { VantResolver } from './vant'
import { VuetifyResolver } from './vuetify'

const defaultLibList: LibItem[] = [
  AntdMobileReactResolver,
  AntdResolver,
  AntDesignVueResolver,
  ArcoDesignReactResolver,
  ElementPlusResolver,
  ElementUIResolver,
  LodashResolver,
  UnderScoreResolver,
  VantResolver,
  VuetifyResolver,
]

export default defaultLibList
