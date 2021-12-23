import { LibResolver } from '../types'
import { pascalCase } from 'pascal-case'

const matchComponents = [
  {
    pattern: /^AnchorLink$/,
    componentDir: 'anchor',
  },
  {
    pattern: /^AvatarGroup$/,
    componentDir: 'avatar',
  },
  {
    pattern: /^BreadcrumbItem$/,
    componentDir: 'breadcrumb',
  },

  {
    pattern: /^ButtonGroup$/,
    componentDir: 'button',
  },
  {
    pattern: /^(CardMeta|CardGrid)$/,
    componentDir: 'card',
  },
  {
    pattern: /^CarouselItem$/,
    componentDir: 'carousel',
  },
  {
    pattern: /^CheckboxGroup$/,
    componentDir: 'checkbox',
  },
  {
    pattern: /^CollapseItem$/,
    componentDir: 'collapse',
  },
  {
    pattern: /^(WeekPicker|MonthPicker|YearPicker|QuarterPicker|RangePicker)$/,
    componentDir: 'date-picker',
  },
  {
    pattern: /^(Doption|Dgroup|Dsubmenu)$/,
    componentDir: 'dropdown',
  },
  {
    pattern: /^FormItem$/,
    componentDir: 'form',
  },
  {
    pattern: /^(Col|Row)$/,
    componentDir: 'grid',
  },

  {
    pattern: /^(ImagePreview|ImagePreviewGroup)$/,
    componentDir: 'image',
  },
  {
    pattern: /^(InputGroup|InputSearch|InputPassword)$/,
    componentDir: 'input',
  },

  {
    pattern: /^(LayoutHeader|LayoutContent|LayoutFooter|LayoutSider)$/,
    componentDir: 'layout',
  },
  {
    pattern: /^(ListItem|ListItemMeta)$/,
    componentDir: 'list',
  },
  {
    pattern: /^(MenuItem|MenuItemGroup|SubMenu)$/,
    componentDir: 'menu',
  },
  {
    pattern: /^RadioGroup$/,
    componentDir: 'radio',
  },
  {
    pattern: /^(Option|Optgroup)$/,
    componentDir: 'select',
  },

  {
    pattern: /^(SkeletonLine|SkeletonShape)$/,
    componentDir: 'table',
  },
  {
    pattern: /^Countdown$/,
    componentDir: 'statistic',
  },

  {
    pattern: /^Step$/,
    componentDir: 'steps',
  },

  {
    pattern: /^(Thead|Td|Th|Tr|Tbody|TableColumn)$/,
    componentDir: 'table',
  },

  {
    pattern: /^TabPane$/,
    componentDir: 'tabs',
  },
  {
    pattern: /^TimelineItem$/,
    componentDir: 'timeline',
  },

  {
    pattern: /^(TypographyParagraph|TypographyTitle|TypographyText)$/,
    componentDir: 'typography',
  },
]

export const ArcoDesignVueResolver: LibResolver = {
  libName: '@arco-design/web-vue',
  replaceOldImport: false,
  style(name) {
    let styleDir = name
    console.log(`@arco-design/web-vue`, name)
    for (const item of matchComponents) {
      if (item.pattern.test(pascalCase(name))) {
        styleDir = item.componentDir
        break
      }
    }
    return `@arco-design/web-vue/es/${styleDir}/style/css.js`
  }
}

