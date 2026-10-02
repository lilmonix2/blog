import TOCInline from 'pliny/ui/TOCInline'
import Pre from './CodeBlock'
import type { MDXComponents } from 'mdx/types'
import ZoomImage from './ZoomImage'
import CustomLink from './Link'
import TableWrapper from './TableWrapper'
import AsapOutputDemo from './AsapOutput'

export const components: MDXComponents = {
  Image: ZoomImage,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  table: TableWrapper,
  AsapOutputDemo,
}
