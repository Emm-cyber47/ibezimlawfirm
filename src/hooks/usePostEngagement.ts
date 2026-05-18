import { useCallback, useSyncExternalStore } from 'react'
import {
  EMPTY_POST_ENGAGEMENT,
  getPostEngagement,
  subscribeEngagement,
} from '../lib/blogEngagement'

export function usePostEngagement(slug: string) {
  const subscribe = useCallback(
    (onStoreChange: () => void) => subscribeEngagement(onStoreChange),
    [],
  )

  const getSnapshot = useCallback(() => getPostEngagement(slug), [slug])

  const getServerSnapshot = useCallback(() => EMPTY_POST_ENGAGEMENT, [])

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
