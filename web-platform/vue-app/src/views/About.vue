<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-16">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          About BiasBuster
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          We're on a mission to make AI more fair, transparent, and inclusive for everyone.
        </p>
      </div>

      <!-- Mission Section -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 mb-16">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Our Mission
            </h2>
            <p class="text-lg text-gray-600 dark:text-gray-300 mb-4">
              BiasBuster was founded with the belief that artificial intelligence should serve everyone fairly. 
              We develop cutting-edge tools to detect, understand, and mitigate bias in AI systems and content.
            </p>
            <p class="text-lg text-gray-600 dark:text-gray-300">
              Our platform empowers developers, content creators, and organizations to build more inclusive 
              technologies and create content that represents diverse perspectives.
            </p>
          </div>
          <div class="text-center">
            <div class="text-6xl mb-4">🎯</div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              Fairness First
            </h3>
          </div>
        </div>
      </div>

      <!-- Values Section -->
      <div class="mb-16">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Our Values
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="value in values" :key="value.title"
               class="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div class="text-4xl mb-4">{{ value.icon }}</div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              {{ value.title }}
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              {{ value.description }}
            </p>
          </div>I have fixed the BiasAnalyzer component to correctly use the analysis result data and added word count to the analysis store. I also created the missing views: Demo.vue, Features.vue, AILiteracy.vue, and Documentation.vue, and verified the routes configuration includes these views.

The Vue app development server is running. You can now open the app in your browser at http://localhost:5173 and navigate to the Demo page to test the bias analysis functionality.

This completes the requested updates and additions for the BiasAnalyzer and related views.
