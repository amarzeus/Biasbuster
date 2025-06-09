<template>
  <div
    class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
    :class="[
      {
        'hover:shadow-md transition-shadow duration-200': hoverable
      }
    ]"
  >
    <!-- Header -->
    <div
      v-if="$slots.header"
      class="border-b border-gray-200 px-4 py-5 dark:border-gray-700 sm:px-6"
    >
      <slot name="header" />
    </div>

    <!-- Image -->
    <div
      v-if="$slots.image"
      class="relative"
    >
      <slot name="image" />
    </div>

    <!-- Body -->
    <div
      v-if="$slots.default"
      class="px-4 py-5 sm:p-6"
    >
      <slot />
    </div>

    <!-- Footer -->
    <div
      v-if="$slots.footer"
      class="border-t border-gray-200 px-4 py-4 dark:border-gray-700 sm:px-6"
    >
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  hoverable: {
    type: Boolean,
    default: false
  }
})
</script> 