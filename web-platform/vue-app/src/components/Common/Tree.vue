<template>
  <div class="tree">
    <ul
      class="space-y-1"
      role="tree"
    >
      <li
        v-for="(item, index) in items"
        :key="index"
        role="treeitem"
        :aria-expanded="item.expanded"
        :aria-level="1"
      >
        <div
          class="flex items-center"
          :class="[
            getItemClasses(item),
            { 'cursor-pointer': item.children?.length }
          ]"
          @click="toggleItem(item)"
        >
          <!-- Toggle Icon -->
          <button
            v-if="item.children?.length"
            class="p-1 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 focus:outline-none"
            :aria-label="item.expanded ? 'Collapse' : 'Expand'"
          >
            <svg
              class="w-4 h-4 transform transition-transform duration-200"
              :class="{ 'rotate-90': item.expanded }"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <!-- Item Content -->
          <div class="flex-1">
            <slot
              name="item"
              :item="item"
              :is-expanded="item.expanded"
            >
              <span
                class="text-sm"
                :class="[
                  item.disabled ? 'text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300',
                  { 'font-medium': item.selected }
                ]"
              >
                {{ item.label }}
              </span>
            </slot>
          </div>
        </div>

        <!-- Children -->
        <Transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 transform -translate-y-2"
          enter-to-class="opacity-100 transform translate-y-0"
          leave-active-class="transition-all duration-150 ease-in"
          leave-from-class="opacity-100 transform translate-y-0"
          leave-to-class="opacity-0 transform -translate-y-2"
        >
          <ul
            v-if="item.expanded && item.children?.length"
            class="mt-1 ml-4 space-y-1"
            role="group"
          >
            <li
              v-for="(child, childIndex) in item.children"
              :key="childIndex"
              role="treeitem"
              :aria-expanded="child.expanded"
              :aria-level="2"
            >
              <div
                class="flex items-center"
                :class="[
                  getItemClasses(child),
                  { 'cursor-pointer': child.children?.length }
                ]"
                @click="toggleItem(child)"
              >
                <!-- Toggle Icon -->
                <button
                  v-if="child.children?.length"
                  class="p-1 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 focus:outline-none"
                  :aria-label="child.expanded ? 'Collapse' : 'Expand'"
                >
                  <svg
                    class="w-4 h-4 transform transition-transform duration-200"
                    :class="{ 'rotate-90': child.expanded }"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>

                <!-- Item Content -->
                <div class="flex-1">
                  <slot
                    name="item"
                    :item="child"
                    :is-expanded="child.expanded"
                  >
                    <span
                      class="text-sm"
                      :class="[
                        child.disabled ? 'text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300',
                        { 'font-medium': child.selected }
                      ]"
                    >
                      {{ child.label }}
                    </span>
                  </slot>
                </div>
              </div>

              <!-- Grandchildren -->
              <Transition
                enter-active-class="transition-all duration-200 ease-out"
                enter-from-class="opacity-0 transform -translate-y-2"
                enter-to-class="opacity-100 transform translate-y-0"
                leave-active-class="transition-all duration-150 ease-in"
                leave-from-class="opacity-100 transform translate-y-0"
                leave-to-class="opacity-0 transform -translate-y-2"
              >
                <ul
                  v-if="child.expanded && child.children?.length"
                  class="mt-1 ml-4 space-y-1"
                  role="group"
                >
                  <li
                    v-for="(grandchild, grandchildIndex) in child.children"
                    :key="grandchildIndex"
                    role="treeitem"
                    :aria-expanded="grandchild.expanded"
                    :aria-level="3"
                  >
                    <div
                      class="flex items-center"
                      :class="[
                        getItemClasses(grandchild),
                        { 'cursor-pointer': grandchild.children?.length }
                      ]"
                      @click="toggleItem(grandchild)"
                    >
                      <!-- Toggle Icon -->
                      <button
                        v-if="grandchild.children?.length"
                        class="p-1 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 focus:outline-none"
                        :aria-label="grandchild.expanded ? 'Collapse' : 'Expand'"
                      >
                        <svg
                          class="w-4 h-4 transform transition-transform duration-200"
                          :class="{ 'rotate-90': grandchild.expanded }"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>

                      <!-- Item Content -->
                      <div class="flex-1">
                        <slot
                          name="item"
                          :item="grandchild"
                          :is-expanded="grandchild.expanded"
                        >
                          <span
                            class="text-sm"
                            :class="[
                              grandchild.disabled ? 'text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300',
                              { 'font-medium': grandchild.selected }
                            ]"
                          >
                            {{ grandchild.label }}
                          </span>
                        </slot>
                      </div>
                    </div>
                  </li>
                </ul>
              </Transition>
            </li>
          </ul>
        </Transition>
      </li>
    </ul>
  </div>
</template>

<script setup>
const props = defineProps({
  items: {
    type: Array,
    required: true,
    validator: (value) => value.every(item => 'label' in item)
  }
})

const emit = defineEmits(['item-toggle', 'item-select'])

// Toggle Item
const toggleItem = (item) => {
  if (item.disabled) return

  if (item.children?.length) {
    item.expanded = !item.expanded
    emit('item-toggle', { item, expanded: item.expanded })
  } else {
    emit('item-select', { item })
  }
}

// Classes
const getItemClasses = (item) => {
  const baseClasses = 'p-2 rounded-lg'
  const stateClasses = {
    disabled: 'opacity-50 cursor-not-allowed',
    selected: 'bg-primary-50 dark:bg-primary-900/50',
    hover: 'hover:bg-gray-50 dark:hover:bg-gray-800'
  }

  return [
    baseClasses,
    item.disabled ? stateClasses.disabled : stateClasses.hover,
    item.selected && !item.disabled ? stateClasses.selected : ''
  ]
}
</script> 