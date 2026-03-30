import { useState, useEffect, useCallback, useRef } from 'react'

export function useData<T>(
  fetcher: () => Promise<T>,
  initial: T,
  deps: any[] = []
): { data: T; loading: boolean; reload: () => void } {
  const [data, setData] = useState<T>(initial)
  const [loading, setLoading] = useState(true)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  const load = useCallback(() => {
    setLoading(true)
    fetcher()
      .then(r => { if (mountedRef.current) setData(r) })
      .catch(() => { if (mountedRef.current) setData(initial) })
      .finally(() => { if (mountedRef.current) setLoading(false) })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => { load() }, [load])

  return { data, loading, reload: load }
}
