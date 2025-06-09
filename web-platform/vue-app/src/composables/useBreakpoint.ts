import { ref, onMounted, onUnmounted } from 'vue'

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
}

export function useBreakpoint() {
  const currentBreakpoint = ref<Breakpoint>('xs')
  const isMobile = ref(false)
  const isTablet = ref(false)
  const isDesktop = ref(false)

  const getBreakpoint = (width: number): Breakpoint => {
    if (width >= breakpoints['2xl']) return '2xl'
    if (width >= breakpoints.xl) return 'xl'
    if (width >= breakpoints.lg) return 'lg'
    if (width >= breakpoints.md) return 'md'
    if (width >= breakpoints.sm) return 'sm'
    return 'xs'
  }

  const updateBreakpoint = () => {
    const width = window.innerWidth
    currentBreakpoint.value = getBreakpoint(width)
    isMobile.value = width < breakpoints.md
    isTablet.value = width >= breakpoints.md && width < breakpoints.lg
    isDesktop.value = width >= breakpoints.lg
  }

  const isGreaterThan = (breakpoint: Breakpoint) => {
    return window.innerWidth >= breakpoints[breakpoint]
  }

  const isLessThan = (breakpoint: Breakpoint) => {
    return window.innerWidth < breakpoints[breakpoint]
  }

  onMounted(() => {
    updateBreakpoint()
    window.addEventListener('resize', updateBreakpoint)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateBreakpoint)
  })

  return {
    currentBreakpoint,
    isMobile,
    isTablet,
    isDesktop,
    isGreaterThan,
    isLessThan
  }
} 