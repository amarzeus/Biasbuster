<template>
  <div>
    <!-- Hero Section -->
    <section class="relative bg-white dark:bg-gray-900 overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div class="text-center">
          <h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            <span class="block">Detect Media Bias</span>
            <span class="block text-trust-blue dark:text-trust-teal">in Real-Time</span>
          </h1>
          <p class="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 dark:text-gray-300">
            BiasBuster uses advanced AI to analyze news articles, identify potential biases, and provide balanced perspectives. Make informed decisions with our powerful bias detection tools.
          </p>
          <div class="mt-8 flex justify-center space-x-4">
            <router-link
              to="/demo"
              class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-trust-blue hover:bg-trust-blue/90 dark:bg-trust-teal dark:hover:bg-trust-teal/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-trust-blue dark:focus:ring-trust-teal transition-colors duration-200"
            >
              Try Demo
            </router-link>
            <a
              href="#features"
              class="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-trust-blue dark:focus:ring-trust-teal transition-colors duration-200"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Analysis Demo Section -->
    <section class="bg-gray-50 dark:bg-gray-800 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BiasAnalyzer />
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="bg-white dark:bg-gray-900 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            World-Class Bias Detection
          </h2>
          <p class="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
            Our platform offers comprehensive tools and features to help you identify and understand media bias.
          </p>
        </div>

        <div class="mt-16">
          <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <!-- Real-time Analysis -->
            <div class="relative group">
              <div class="h-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div>
                  <span class="inline-flex items-center justify-center p-3 bg-trust-blue/10 dark:bg-trust-teal/10 rounded-md">
                    📊
                  </span>
                </div>
                <div class="mt-4">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white">Real-time Analysis</h3>
                  <p class="mt-2 text-base text-gray-600 dark:text-gray-300">
                    Get instant feedback on potential biases as you type or paste content.
                  </p>
                </div>
              </div>
            </div>

            <!-- Multiple Bias Types -->
            <div class="relative group">
              <div class="h-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div>
                  <span class="inline-flex items-center justify-center p-3 bg-trust-blue/10 dark:bg-trust-teal/10 rounded-md">
                    🏷️
                  </span>
                </div>
                <div class="mt-4">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white">Multiple Bias Types</h3>
                  <p class="mt-2 text-base text-gray-600 dark:text-gray-300">
                    Detect various types of bias including political, gender, racial, and cultural bias.
                  </p>
                </div>
              </div>
            </div>

            <!-- Customizable Settings -->
            <div class="relative group">
              <div class="h-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div>
                  <span class="inline-flex items-center justify-center p-3 bg-trust-blue/10 dark:bg-trust-teal/10 rounded-md">
                    ⚙️
                  </span>
                </div>
                <div class="mt-4">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white">Customizable Settings</h3>
                  <p class="mt-2 text-base text-gray-600 dark:text-gray-300">
                    Adjust sensitivity levels and customize bias detection rules to match your needs.
                  </p>
                </div>
              </div>
            </div>

            <!-- Visual Highlighting -->
            <div class="relative group">
              <div class="h-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div>
                  <span class="inline-flex items-center justify-center p-3 bg-trust-blue/10 dark:bg-trust-teal/10 rounded-md">
                    🎨
                  </span>
                </div>
                <div class="mt-4">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white">Visual Highlighting</h3>
                  <p class="mt-2 text-base text-gray-600 dark:text-gray-300">
                    See biased content highlighted directly in the text with customizable colors.
                  </p>
                </div>
              </div>
            </div>

            <!-- Detailed Reports -->
            <div class="relative group">
              <div class="h-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div>
                  <span class="inline-flex items-center justify-center p-3 bg-trust-blue/10 dark:bg-trust-teal/10 rounded-md">
                    📈
                  </span>
                </div>
                <div class="mt-4">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white">Detailed Reports</h3>
                  <p class="mt-2 text-base text-gray-600 dark:text-gray-300">
                    Get comprehensive analysis reports with suggestions for more neutral language.
                  </p>
                </div>
              </div>
            </div>

            <!-- Browser Extension -->
            <div class="relative group">
              <div class="h-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div>
                  <span class="inline-flex items-center justify-center p-3 bg-trust-blue/10 dark:bg-trust-teal/10 rounded-md">
                    🧩
                  </span>
                </div>
                <div class="mt-4">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white">Browser Extension</h3>
                  <p class="mt-2 text-base text-gray-600 dark:text-gray-300">
                    Analyze content directly on any webpage with our Chrome extension.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-trust-blue dark:bg-trust-teal">
      <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <h2 class="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          <span class="block">Ready to detect bias?</span>
          <span class="block text-blue-100">Start using BiasBuster today.</span>
        </h2>
        <div class="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <div class="inline-flex rounded-md shadow">
            <router-link
              to="/demo"
              class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-trust-blue dark:text-trust-teal bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              Get started
            </router-link>
          </div>
          <div class="ml-3 inline-flex rounded-md shadow">
            <router-link
              to="/docs"
              class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Learn more
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import BiasAnalyzer from '@/components/Analysis/BiasAnalyzer.vue'
</script>
