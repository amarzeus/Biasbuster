<template>
  <div class="flow-root">
    <ul
      role="list"
      class="-mb-8"
    >
      <li
        v-for="(item, index) in items"
        :key="item.id"
      >
        <div class="relative pb-8">
          <!-- Timeline line -->
          <span
            v-if="index !== items.length - 1"
            class="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
            aria-hidden="true"
          />

          <div class="relative flex space-x-3">
            <!-- Timeline icon -->
            <div>
              <span
                :class="[
                  'flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white dark:ring-gray-800',
                  getVariantClasses(item.variant)
                ]"
              >
                <component
                  v-if="item.icon"
                  :is="item.icon"
                  class="h-5 w-5 text-white"
                />
                <span
                  v-else
                  class="text-sm font-medium text-white"
                >
                  {{ item.initial }}
                </span>
              </span>
            </div>

            <!-- Timeline content -->
            <div class="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ item.content }}
                  <a
                    v-if="item.href"
                    :href="item.href"
                    class="font-medium text-gray-900 dark:text-gray-100"
                  >
                    {{ item.hrefText }}
                  </a>
                </p>
              </div>
              <div class="whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
                <time :datetime="item.datetime">
                  {{ item.time }}
                </time>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
const props = defineProps({
  items: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every(item => {
        return (
          typeof item.id === 'string' &&
          typeof item.content === 'string' &&
          typeof item.time === 'string' &&
          typeof item.datetime === 'string' &&
          (!item.icon || typeof item.icon === 'object') &&
          (!item.initial || typeof item.initial === 'string') &&
          (!item.variant || ['primary', 'success', 'warning', 'error', 'info'].includes(item.variant)) &&
          (!item.href || typeof item.href === 'string') &&
          (!item.hrefText || typeof item.hrefText === 'string')
        )
      })
    }
  }
})

// Classes
const getVariantClasses = (variant = 'primary') => {
  const variantClasses = {
    primary: 'bg-primary-500',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    error: 'bg-error-500',
    info: 'bg-info-500'
  }
  return variantClasses[variant]
}
</script> 