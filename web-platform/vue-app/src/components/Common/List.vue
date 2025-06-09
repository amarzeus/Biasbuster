<template>
  <div class="w-full">
    <!-- List Container -->
    <ul
      class="divide-y divide-gray-200 dark:divide-gray-700"
      :class="{
        'rounded-lg border border-gray-200 dark:border-gray-700': bordered
      }"
    >
      <li
        v-for="(item, index) in items"
        :key="index"
        class="relative"
      >
        <!-- List Item -->
        <div
          class="flex items-center px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50"
          :class="{
            'cursor-pointer': clickable,
            'opacity-50': item.disabled
          }"
          @click="!item.disabled && clickable && $emit('item-click', item)"
        >
          <!-- Leading Icon -->
          <div
            v-if="$slots['leading-icon']"
            class="mr-3 flex-shrink-0"
          >
            <slot
              name="leading-icon"
              :item="item"
              :index="index"
            />
          </div>

          <!-- Content -->
          <div class="flex-1">
            <slot
              name="item"
              :item="item"
              :index="index"
            >
              <!-- Default Content -->
              <div class="space-y-1">
                <!-- Title -->
                <div
                  v-if="item.title"
                  class="text-sm font-medium"
                  :class="{
                    'text-gray-900 dark:text-white': !item.disabled,
                    'text-gray-500 dark:text-gray-400': item.disabled
                  }"
                >
                  {{ item.title }}
                </div>

                <!-- Description -->
                <div
                  v-if="item.description"
                  class="text-sm"
                  :class="{
                    'text-gray-500 dark:text-gray-400': !item.disabled,
                    'text-gray-400 dark:text-gray-500': item.disabled
                  }"
                >
                  {{ item.description }}
                </div>
              </div>
            </slot>
          </div>

          <!-- Trailing Icon -->
          <div
            v-if="$slots['trailing-icon']"
            class="ml-3 flex-shrink-0"
          >
            <slot
              name="trailing-icon"
              :item="item"
              :index="index"
            />
          </div>
        </div>

        <!-- Divider -->
        <div
          v-if="index < items.length - 1 && !bordered"
          class="absolute bottom-0 left-0 right-0 h-px bg-gray-200 dark:bg-gray-700"
        />
      </li>
    </ul>

    <!-- Empty State -->
    <div
      v-if="items.length === 0"
      class="rounded-lg border border-gray-200 bg-white px-4 py-5 text-center dark:border-gray-700 dark:bg-gray-800"
    >
      <slot name="empty">
        {{ emptyText }}
      </slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every(item => {
        return (
          typeof item.title === 'string' &&
          (!item.description || typeof item.description === 'string') &&
          (!item.disabled || typeof item.disabled === 'boolean')
        )
      })
    }
  },
  clickable: {
    type: Boolean,
    default: false
  },
  bordered: {
    type: Boolean,
    default: false
  },
  emptyText: {
    type: String,
    default: 'No items available'
  }
})

defineEmits(['item-click'])
</script> 