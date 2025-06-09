<template>
  <div
    class="relative"
    role="region"
    :aria-label="ariaLabel"
  >
    <!-- Carousel container -->
    <div
      ref="containerRef"
      class="overflow-hidden"
      @mouseenter="pauseAutoplay"
      @mouseleave="resumeAutoplay"
    >
      <div
        class="flex transition-transform duration-500 ease-out"
        :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      >
        <div
          v-for="(slide, index) in slides"
          :key="index"
          class="w-full flex-shrink-0"
        >
          <slot
            :name="`slide-${index}`"
            :slide="slide"
          >
            <img
              :src="slide.image"
              :alt="slide.alt || ''"
              class="h-full w-full object-cover"
            />
          </slot>
        </div>
      </div>
    </div>

    <!-- Navigation controls -->
    <template v-if="showControls">
      <button
        type="button"
        class="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-800 shadow-lg hover:bg-white dark:bg-gray-800/80 dark:text-gray-200 dark:hover:bg-gray-800"
        :aria-label="previousLabel"
        @click="previous"
      >
        <span class="sr-only">{{ previousLabel }}</span>
        <svg
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
      <button
        type="button"
        class="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-800 shadow-lg hover:bg-white dark:bg-gray-800/80 dark:text-gray-200 dark:hover:bg-gray-800"
        :aria-label="nextLabel"
        @click="next"
      >
        <span class="sr-only">{{ nextLabel }}</span>
        <svg
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </template>

    <!-- Indicators -->
    <div
      v-if="showIndicators"
      class="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2"
    >
      <button
        v-for="(_, index) in slides"
        :key="index"
        type="button"
        class="h-2 w-2 rounded-full transition-colors"
        :class="[
          index === currentIndex
            ? 'bg-white dark:bg-gray-200'
            : 'bg-white/50 hover:bg-white/75 dark:bg-gray-200/50 dark:hover:bg-gray-200/75'
        ]"
        :aria-label="`Go to slide ${index + 1}`"
        @click="goToSlide(index)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  slides: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every(slide => {
        return (
          typeof slide.image === 'string' &&
          (!slide.alt || typeof slide.alt === 'string')
        )
      })
    }
  },
  autoplay: {
    type: Boolean,
    default: true
  },
  interval: {
    type: Number,
    default: 5000
  },
  showControls: {
    type: Boolean,
    default: true
  },
  showIndicators: {
    type: Boolean,
    default: true
  },
  ariaLabel: {
    type: String,
    default: 'Image carousel'
  },
  previousLabel: {
    type: String,
    default: 'Previous slide'
  },
  nextLabel: {
    type: String,
    default: 'Next slide'
  }
})

const currentIndex = ref(0)
const containerRef = ref(null)
let autoplayInterval = null

// Methods
const next = () => {
  currentIndex.value = (currentIndex.value + 1) % props.slides.length
}

const previous = () => {
  currentIndex.value = (currentIndex.value - 1 + props.slides.length) % props.slides.length
}

const goToSlide = (index) => {
  currentIndex.value = index
}

const startAutoplay = () => {
  if (props.autoplay) {
    autoplayInterval = setInterval(next, props.interval)
  }
}

const pauseAutoplay = () => {
  if (autoplayInterval) {
    clearInterval(autoplayInterval)
    autoplayInterval = null
  }
}

const resumeAutoplay = () => {
  startAutoplay()
}

// Lifecycle hooks
onMounted(() => {
  startAutoplay()
})

onUnmounted(() => {
  pauseAutoplay()
})
</script>

<style scoped>
.transition-transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 500ms;
}
</style> 