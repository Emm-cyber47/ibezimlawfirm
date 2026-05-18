import { useCallback, useEffect, useState } from 'react'
import {
  listClientDocuments,
  subscribeClientDocuments,
  type ClientDocument,
} from '../lib/clientDocuments'

export function useClientDocuments(userEmail: string | undefined) {
  const [documents, setDocuments] = useState<ClientDocument[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!userEmail) {
      setDocuments([])
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const list = await listClientDocuments(userEmail)
      setDocuments(list)
    } catch {
      setDocuments([])
    } finally {
      setLoading(false)
    }
  }, [userEmail])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    if (!userEmail) return
    return subscribeClientDocuments(() => {
      refresh()
    })
  }, [userEmail, refresh])

  return { documents, loading, refresh }
}
