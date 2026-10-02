import { getPostSummaries } from '@/lib/content'
import Main from './Main'

export default function Page() {
  return <Main posts={getPostSummaries()} />
}
