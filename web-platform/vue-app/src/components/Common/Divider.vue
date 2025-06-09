<template>
  <div
    :class="[
      'flex items-center',
      orientation === 'horizontal' ? 'w-full' : 'h-full',
      orientation === 'horizontal' ? 'my-4' : 'mx-4'
    ]"
  >
    <div
      v-if="orientation === 'horizontal'"
      :class="[
        'w-full border-t',
        getVariantClasses()
      ]"
    />
    <div
      v-else
      :class="[
        'h-full border-l',
        getVariantClasses()
      ]"
    />
    <div
      v-if="$slots.default"
      :class="[
        'px-4 text-sm text-gray-500 dark:text-gray-400',
        orientation === 'horizontal' ? 'whitespace-nowrap' : 'writing-vertical-rl'
      ]"
    >
      <slot />
    </div>
    <div
      v-if="$slots.default"
      :class="[
        orientation === 'horizontal' ? 'w-full border-t' : 'h-full border-l',
        getVariantClasses()
      ]"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'dashed', 'dotted'].includes(value)
  },
  orientation: {
    type: String,
    default: 'horizontal',
    validator: (value) => ['horizontal', 'vertical'].includes(value)
  }
})

// Classes
const getVariantClasses = () => {
  const variantClasses = {
    default: 'border-gray-200 dark:border-gray-700',
    dashed: 'border-dashed border-gray-200 dark:border-gray-700',
    dotted: 'border-dotted border-gray-200 dark:border-gray-700'
  }
  return variantClasses[props.variant]
}
</script>

<style>
.writing-vertical-rl {
  writing-mode: vertical-rl;
  text-orientation: mixed;
}
</style> 