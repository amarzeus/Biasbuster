<template>
  <nav
    :id="id"
    class="flex items-center justify-between"
    :class="[className]"
    aria-label="Pagination"
  >
    <!-- Previous button -->
    <div class="flex flex-1 justify-start">
      <button
        type="button"
        class="relative inline-flex items-center rounded-md px-2 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500"
        :class="[
          currentPage === 1
            ? 'cursor-not-allowed text-gray-400 dark:text-gray-500'
            : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800',
          getSizeClasses()
        ]"
        :disabled="currentPage === 1"
        @click="handlePageChange(currentPage - 1)"
      >
        <span class="sr-only">Previous</span>
        <svg
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>

    <!-- Page numbers -->
    <div class="hidden md:flex md:flex-1 md:items-center md:justify-center">
      <div>
        <p class="text-sm text-gray-700 dark:text-gray-300">
          Showing
          <span class="font-medium">{{ getStartItem() }}</span>
          to
          <span class="font-medium">{{ getEndItem() }}</span>
          of
          <span class="font-medium">{{ totalItems }}</span>
          results
        </p>
      </div>
      <div class="ml-6">
        <div class="isolate inline-flex -space-x-px rounded-md shadow-sm">
          <template v-for="(page, index) in getPageNumbers()" :key="index">
            <!-- First page -->
            <button
              v-if="page === 1 && showFirstLast"
              type="button"
              class="relative inline-flex items-center rounded-l-md px-2 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500"
              :class="[
                currentPage === page
                  ? 'z-10 bg-primary-600 text-white focus:z-20'
                  : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800',
                getSizeClasses()
              ]"
              @click="handlePageChange(page)"
            >
              {{ page }}
            </button>

            <!-- Ellipsis -->
            <span
              v-else-if="page === '...'"
              class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              :class="getSizeClasses()"
            >
              ...
            </span>

            <!-- Page number -->
            <button
              v-else
              type="button"
              class="relative inline-flex items-center px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500"
              :class="[
                currentPage === page
                  ? 'z-10 bg-primary-600 text-white focus:z-20'
                  : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800',
                page === 1 ? 'rounded-l-md' : '',
                page === totalPages ? 'rounded-r-md' : '',
                getSizeClasses()
              ]"
              @click="handlePageChange(page)"
            >
              {{ page }}
            </button>

            <!-- Last page -->
            <button
              v-if="page === totalPages && showFirstLast"
              type="button"
              class="relative inline-flex items-center rounded-r-md px-2 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500"
              :class="[
                currentPage === page
                  ? 'z-10 bg-primary-600 text-white focus:z-20'
                  : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800',
                getSizeClasses()
              ]"
              @click="handlePageChange(page)"
            >
              {{ page }}
            </button>
          </template>
        </div>
      </div>
    </div>

    <!-- Next button -->
    <div class="flex flex-1 justify-end">
      <button
        type="button"
        class="relative inline-flex items-center rounded-md px-2 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500"
        :class="[
          currentPage === totalPages
            ? 'cursor-not-allowed text-gray-400 dark:text-gray-500'
            : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800',
          getSizeClasses()
        ]"
        :disabled="currentPage === totalPages"
        @click="handlePageChange(currentPage + 1)"
      >
        <span class="sr-only">Next</span>
        <svg
          class="h-5 w-5"
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
      </button>
    </div>
  </nav>
</template>

<script setup>
const props = defineProps({
  id: {
    type: String,
    required: true
  },
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  totalItems: {
    type: Number,
    required: true
  },
  pageSize: {
    type: Number,
    default: 10
  },
  maxVisiblePages: {
    type: Number,
    default: 5
  },
  showFirstLast: {
    type: Boolean,
    default: true
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

const emit = defineEmits(['update:currentPage'])

const getSizeClasses = () => {
  const sizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }
  return sizes[props.size]
}

const getStartItem = () => {
  return (props.currentPage - 1) * props.pageSize + 1
}

const getEndItem = () => {
  return Math.min(props.currentPage * props.pageSize, props.totalItems)
}

const getPageNumbers = () => {
  const pages = []
  const halfVisible = Math.floor(props.maxVisiblePages / 2)
  let start = Math.max(1, props.currentPage - halfVisible)
  let end = Math.min(props.totalPages, start + props.maxVisiblePages - 1)

  if (end - start + 1 < props.maxVisiblePages) {
    start = Math.max(1, end - props.maxVisiblePages + 1)
  }

  if (start > 1) {
    pages.push(1)
    if (start > 2) {
      pages.push('...')
    }
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  if (end < props.totalPages) {
    if (end < props.totalPages - 1) {
      pages.push('...')
    }
    pages.push(props.totalPages)
  }

  return pages
}

const handlePageChange = (page) => {
  if (page >= 1 && page <= props.totalPages) {
    emit('update:currentPage', page)
  }
}
</script> 