import { App } from 'vue';
import { performanceMonitor } from '@/services/performance-monitor';
import PerformanceDashboard from '@/components/PerformanceDashboard.vue';

export default {
  install: (app: App) => {
    // Register global component
    app.component('PerformanceDashboard', PerformanceDashboard);

    // Add performance monitoring to router
    app.router?.beforeEach((to, from, next) => {
      performanceMonitor.reset();
      next();
    });

    // Add performance monitoring to Vue lifecycle
    app.mixin({
      mounted() {
        if (this.$options.name) {
          const startTime = performance.now();
          this.$nextTick(() => {
            const endTime = performance.now();
            performanceMonitor.metrics.set(
              `${this.$options.name}MountTime`,
              endTime - startTime
            );
          });
        }
      }
    });

    // Add performance monitoring to Vuex/Pinia
    if (app.config.globalProperties.$store) {
      const store = app.config.globalProperties.$store;
      const originalCommit = store.commit;
      const originalDispatch = store.dispatch;

      store.commit = function(...args: any[]) {
        const startTime = performance.now();
        const result = originalCommit.apply(this, args);
        const endTime = performance.now();
        performanceMonitor.metrics.set(
          `storeCommit_${args[0]}`,
          endTime - startTime
        );
        return result;
      };

      store.dispatch = function(...args: any[]) {
        const startTime = performance.now();
        const result = originalDispatch.apply(this, args);
        const endTime = performance.now();
        performanceMonitor.metrics.set(
          `storeDispatch_${args[0]}`,
          endTime - startTime
        );
        return result;
      };
    }

    // Add performance monitoring to HTTP requests
    if (app.config.globalProperties.$axios) {
      const axios = app.config.globalProperties.$axios;
      axios.interceptors.request.use(
        config => {
          config.metadata = { startTime: performance.now() };
          return config;
        },
        error => Promise.reject(error)
      );

      axios.interceptors.response.use(
        response => {
          const endTime = performance.now();
          const startTime = response.config.metadata.startTime;
          performanceMonitor.metrics.set(
            `httpRequest_${response.config.url}`,
            endTime - startTime
          );
          return response;
        },
        error => Promise.reject(error)
      );
    }

    // Add performance monitoring to Vue components
    app.directive('performance', {
      mounted(el, binding) {
        const startTime = performance.now();
        el._performanceStartTime = startTime;

        if (binding.value) {
          const { name, threshold } = binding.value;
          el._performanceName = name;
          el._performanceThreshold = threshold;
        }
      },
      updated(el) {
        if (el._performanceStartTime) {
          const endTime = performance.now();
          const duration = endTime - el._performanceStartTime;
          
          if (el._performanceName) {
            performanceMonitor.metrics.set(
              el._performanceName,
              duration
            );

            if (el._performanceThreshold && duration > el._performanceThreshold) {
              console.warn(
                `Performance warning: ${el._performanceName} took ${duration}ms (threshold: ${el._performanceThreshold}ms)`
              );
            }
          }
        }
      }
    });

    // Add performance monitoring to Vue transitions
    app.directive('transition-performance', {
      beforeEnter(el) {
        el._transitionStartTime = performance.now();
      },
      afterEnter(el) {
        if (el._transitionStartTime) {
          const duration = performance.now() - el._transitionStartTime;
          performanceMonitor.metrics.set(
            'transitionDuration',
            duration
          );
        }
      }
    });

    // Add performance monitoring to Vue animations
    app.directive('animation-performance', {
      mounted(el, binding) {
        const observer = new IntersectionObserver(
          entries => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                const startTime = performance.now();
                el._animationStartTime = startTime;
              }
            });
          },
          { threshold: 0.1 }
        );

        observer.observe(el);
        el._animationObserver = observer;
      },
      updated(el) {
        if (el._animationStartTime) {
          const duration = performance.now() - el._animationStartTime;
          performanceMonitor.metrics.set(
            'animationDuration',
            duration
          );
        }
      },
      unmounted(el) {
        if (el._animationObserver) {
          el._animationObserver.disconnect();
        }
      }
    });
  }
}; 