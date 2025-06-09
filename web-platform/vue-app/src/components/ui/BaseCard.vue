<template>
  <div
    :class="[
      'relative overflow-hidden transition-all duration-200',
      // Base styles
      'bg-white dark:bg-gray-700',
      // Border styles
      {
        'border border-gray-200 dark:border-gray-600': bordered,
        'rounded-lg': rounded,
      },
      // Shadow styles
      {
        'shadow-sm': shadow === 'sm',
        'shadow': shadow === 'md',
        'shadow-md': shadow === 'lg',
        'shadow-lg': shadow === 'xl',
      },
      // Hover effects
      {
        'hover:shadow-md': hoverable && shadow === 'sm',
        'hover:shadow-lg': hoverable && shadow === 'md',
        'hover:shadow-xl': hoverable && shadow === 'lg',
        'hover:shadow-2xl': hoverable && shadow === 'xl',
        'hover:-translate-y-1': hoverable,
      },
      // Interactive styles
      {
        'cursor-pointer': clickable,
        'active:scale-95': clickable,
      },
      // Custom classes
      customClass,
    ]"
    @click="handleClick"
  >
    <!-- Card header -->
    <div
      v-if="$slots.header"
      :class="[
        'px-6 py-4 border-b border-gray-200 dark:border-gray-600',
        headerClass,
      ]"
    >
      <slot name="header"></slot>
    </div>

    <!-- Card image -->
    <div
      v-if="$slots.image"
      :class="[
        'relative',
        {
          'rounded-t-lg': rounded && !$slots.header,
        },
        imageClass,
      ]"
    >
      <slot name="image"></slot>
    </div>

    <!-- Card body -->
    <div
      :class="[
        'px-6 py-4',
        {
          'rounded-t-lg': rounded && !$slots.header && !$slots.image,
          'rounded-b-lg': rounded && !$slots.footer,
        },
        bodyClass,
      ]"
    >
      <slot></slot>
    </div>

    <!-- Card footer -->
    <div
      v-if="$slots.footer"
      :class="[
        'px-6 py-4 border-t border-gray-200 dark:border-gray-600',
        {
          'rounded-b-lg': rounded,
        },
        footerClass,
      ]"
    >
      <slot name="footer"></slot>
    </div>

    <!-- Loading overlay -->
    <div
      v-if="loading"
      class="absolute inset-0 bg-white dark:bg-gray-700 bg-opacity-75 dark:bg-opacity-75 flex items-center justify-center"
    >
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  bordered?: boolean
  rounded?: boolean
  shadow?: 'sm' | 'md' | 'lg' | 'xl'
  hoverable?: boolean
  clickable?: boolean
  loading?: boolean
  headerClass?: string
  bodyClass?: string
  footerClass?: string
  imageClass?: string
  customClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  bordered: true,
  rounded: true,
  shadow: 'md',
  hoverable: false,
  clickable: false,
  loading: false,
  headerClass: '',
  bodyClass: '',
  footerClass: '',
  imageClass: '',
  customClass: '',
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const handleClick = (event: MouseEvent) => {
  if (props.clickable) {
    emit('click', event)
  }
}
</script> 