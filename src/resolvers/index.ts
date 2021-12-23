import { LibResolver } from '../types'
import { AntdMobileReactResolver } from './antd-mobile'
import { AntdResolver } from './antd'
import { AntDesignVueResolver } from './antdv'
import { ArcoDesignReactResolver } from './arco-design-react'
import { ArcoDesignVueResolver } from './arco-design-vue'
import { ElementPlusResolver } from './element-plus'
import { ElementUIResolver } from './element-ui'
import { ViewUIResolver } from './view-ui'
import { LodashResolver } from './lodash'
import { UnderScoreResolver } from './underscore'
import { VantResolver } from './vant'
import { VuetifyResolver } from './vuetify'

const defaultLibList: LibResolver[] = [
  AntdMobileReactResolver,
  AntdResolver,
  AntDesignVueResolver,
  ArcoDesignReactResolver,
  ArcoDesignVueResolver,
  ElementPlusResolver,
  ElementUIResolver,
  ViewUIResolver,
  LodashResolver,
  UnderScoreResolver,
  VantResolver,
  VuetifyResolver,
]

export default defaultLibList
