<template>
  <nav
    :id="id"
    class="flex"
    :class="[className]"
    aria-label="Breadcrumb"
  >
    <ol
      class="flex items-center space-x-1 md:space-x-2"
      :class="[getSizeClasses()]"
    >
      <li
        v-for="(item, index) in items"
        :key="item.id"
        class="flex items-center"
      >
        <!-- Separator -->
        <div
          v-if="index > 0"
          class="mx-1 md:mx-2"
          :class="[getSeparatorClasses()]"
        >
          <slot name="separator">
            <svg
              class="h-5 w-5 flex-shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                clip-rule="evenodd"
              />
            </svg>
          </slot>
        </div>

        <!-- Item -->
        <div class="flex items-center">
          <component
            :is="item.href ? 'a' : 'span'"
            :href="item.href"
            :class="[
              index === items.length - 1
                ? 'font-medium text-gray-900 dark:text-white'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
              getItemClasses()
            ]"
            :aria-current="index === items.length - 1 ? 'page' : undefined"
          >
            <!-- Icon -->
            <component
              v-if="item.icon"
              :is="item.icon"
              class="mr-2 h-5 w-5 flex-shrink-0"
              :class="[
                index === items.length - 1
                  ? 'text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400'
              ]"
              aria-hidden="true"
            />

            <!-- Label -->
            {{ item.label }}
          </component>
        </div>
      </li>
    </ol>
  </nav>
</template>

<script setup>
const props = defineProps({
  id: {
    type: String,
    required: true
  },
  items: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every(item => {
        return (
          typeof item === 'object' &&
          typeof item.id === 'string' &&
          typeof item.label === 'string' &&
          (item.href === undefined || typeof item.href === 'string') &&
          (item.icon === undefined || typeof item.icon === 'string')
        )
      })
    }
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  className: {
    type: String,
    default: ''
  }
})

const getSizeClasses = () => {
  const sizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }
  return sizes[props.size]
}

const getSeparatorClasses = () => {
  const sizes = {
    sm: 'text-gray-400 dark:text-gray-500',
    md: 'text-gray-400 dark:text-gray-500',
    lg: 'text-gray-400 dark:text-gray-500'
  }
  return sizes[props.size]
}

const getItemClasses = () => {
  const sizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }
  return sizes[props.size]
}
</script> 