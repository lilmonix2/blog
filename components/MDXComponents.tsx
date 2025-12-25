import TOCInline from 'pliny/ui/TOCInline'
import Pre from 'pliny/ui/Pre'
import BlogNewsletterForm from 'pliny/ui/BlogNewsletterForm'
import type { MDXComponents } from 'mdx/types'
import ZoomImage from './ZoomImage'
import CustomLink from './Link'
import TableWrapper from './TableWrapper'
import AsapOutputDemo from '@/data/demos/AsapOutput'

export const components: MDXComponents = {
  Image: ZoomImage,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  table: TableWrapper,
  BlogNewsletterForm,
  AsapOutputDemo,
}
