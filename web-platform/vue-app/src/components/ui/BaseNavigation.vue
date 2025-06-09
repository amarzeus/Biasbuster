<template>
  <nav
    :class="[
      'relative z-50',
      {
        'bg-white dark:bg-gray-900': !transparent,
        'bg-transparent': transparent,
      },
      customClass,
    ]"
  >
    <!-- Desktop Navigation -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo -->
        <div class="flex-shrink-0 flex items-center">
          <slot name="logo">
            <img
              class="h-8 w-auto"
              src="/assets/logo.svg"
              alt="Biasbuster"
            />
          </slot>
        </div>

        <!-- Desktop Menu -->
        <div class="hidden md:flex md:items-center md:space-x-8">
          <template v-for="(item, index) in items" :key="index">
            <!-- Dropdown Menu -->
            <div
              v-if="item.children"
              class="relative"
              @mouseenter="activeDropdown = item.id"
              @mouseleave="activeDropdown = null"
            >
              <button
                :class="[
                  'inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors duration-200',
                  {
                    'border-primary-500 text-gray-900 dark:text-white': activeDropdown === item.id,
                    'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200': activeDropdown !== item.id,
                  },
                ]"
              >
                {{ item.label }}
                <svg
                  class="ml-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>

              <!-- Dropdown Content -->
              <div
                v-show="activeDropdown === item.id"
                class="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5"
              >
                <div class="py-1">
                  <a
                    v-for="child in item.children"
                    :key="child.id"
                    :href="child.href"
                    :class="[
                      'block px-4 py-2 text-sm transition-colors duration-200',
                      {
                        'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700': !child.active,
                        'bg-gray-100 dark:bg-gray-700 text-primary-500': child.active,
                      },
                    ]"
                  >
                    {{ child.label }}
                  </a>
                </div>
              </div>
            </div>

            <!-- Regular Menu Item -->
            <a
              v-else
              :href="item.href"
              :class="[
                'inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors duration-200',
                {
                  'border-primary-500 text-gray-900 dark:text-white': item.active,
                  'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200': !item.active,
                },
              ]"
            >
              {{ item.label }}
            </a>
          </template>
        </div>

        <!-- Right Side Actions -->
        <div class="hidden md:flex md:items-center md:space-x-4">
          <slot name="actions"></slot>
        </div>

        <!-- Mobile Menu Button -->
        <div class="flex items-center md:hidden">
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
          >
            <span class="sr-only">Open main menu</span>
            <svg
              class="h-6 w-6"
              :class="{ 'hidden': mobileMenuOpen, 'block': !mobileMenuOpen }"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <svg
              class="h-6 w-6"
              :class="{ 'block': mobileMenuOpen, 'hidden': !mobileMenuOpen }"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div
      v-show="mobileMenuOpen"
      class="md:hidden"
    >
      <div class="pt-2 pb-3 space-y-1">
        <template v-for="(item, index) in items" :key="index">
          <!-- Mobile Dropdown -->
          <div v-if="item.children">
            <button
              @click="mobileDropdown = mobileDropdown === item.id ? null : item.id"
              class="w-full flex items-center justify-between px-3 py-2 text-base font-medium text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {{ item.label }}
              <svg
                class="ml-2 h-5 w-5"
                :class="{ 'transform rotate-180': mobileDropdown === item.id }"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
            <div
              v-show="mobileDropdown === item.id"
              class="pl-4 space-y-1"
            >
              <a
                v-for="child in item.children"
                :key="child.id"
                :href="child.href"
                :class="[
                  'block px-3 py-2 text-base font-medium transition-colors duration-200',
                  {
                    'text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700': !child.active,
                    'bg-gray-100 dark:bg-gray-700 text-primary-500': child.active,
                  },
                ]"
              >
                {{ child.label }}
              </a>
            </div>
          </div>

          <!-- Mobile Regular Item -->
          <a
            v-else
            :href="item.href"
            :class="[
              'block px-3 py-2 text-base font-medium transition-colors duration-200',
              {
                'text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700': !item.active,
                'bg-gray-100 dark:bg-gray-700 text-primary-500': item.active,
              },
            ]"
          >
            {{ item.label }}
          </a>
        </template>
      </div>

      <!-- Mobile Actions -->
      <div class="pt-4 pb-3 border-t border-gray-200 dark:border-gray-600">
        <div class="px-4 space-y-4">
          <slot name="mobile-actions"></slot>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface MenuItem {
  id: string
  label: string
  href?: string
  active?: boolean
  children?: {
    id: string
    label: string
    href: string
    active?: boolean
  }[]
}

interface Props {
  items: MenuItem[]
  transparent?: boolean
  customClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  transparent: false,
  customClass: '',
})

const mobileMenuOpen = ref(false)
const mobileDropdown = ref<string | null>(null)
const activeDropdown = ref<string | null>(null)
</script> 