import { ref, onMounted, onUnmounted } from 'vue'
import { useApi } from './useApi'

interface InfiniteScrollOptions {
  threshold?: number
  rootMargin?: string
  enabled?: boolean
}

export function useInfiniteScroll<T>(
  loadMore: () => Promise<T[]>,
  options: InfiniteScrollOptions = {}
) {
  const {
    threshold = 0.5,
    rootMargin = '0px',
    enabled = true
  } = options

  const items = ref<T[]>([])
  const loading = ref(false)
  const hasMore = ref(true)
  const error = ref<Error | null>(null)
  const observer = ref<IntersectionObserver | null>(null)
  const target = ref<HTMLElement | null>(null)

  const { execute } = useApi<T[]>()

  const loadItems = async () => {
    if (loading.value || !hasMore.value) return

    loading.value = true
    error.value = null

    try {
      const newItems = await execute(loadMore())
      items.value.push(...newItems)
      hasMore.value = newItems.length > 0
    } catch (err) {
      error.value = err as Error
    } finally {
      loading.value = false
    }
  }

  const reset = () => {
    items.value = []
    loading.value = false
    hasMore.value = true
    error.value = null
  }

  const setupObserver = () => {
    if (!enabled || !target.value) return

    observer.value = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && !loading.value && hasMore.value) {
          loadItems()
        }
      },
      {
        threshold,
        rootMargin
      }
    )

    observer.value.observe(target.value)
  }

  onMounted(() => {
    setupObserver()
  })

  onUnmounted(() => {
    if (observer.value) {
      observer.value.disconnect()
    }
  })

  return {
    items,
    loading,
    hasMore,
    error,
    target,
    loadItems,
    reset
  }
} 