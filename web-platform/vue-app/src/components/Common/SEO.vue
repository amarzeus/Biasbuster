<template>
  <div>
    <component
      :is="'script'"
      type="application/ld+json"
      v-html="structuredData"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title: string
  description: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  author?: string
  publishedAt?: string
  modifiedAt?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'website',
  image: '/og-image.jpg',
  url: '',
  author: 'Biasbuster',
  publishedAt: '',
  modifiedAt: ''
})

const structuredData = computed(() => {
  const data = {
    '@context': 'https://schema.org',
    '@type': props.type === 'article' ? 'Article' : 'WebPage',
    name: props.title,
    description: props.description,
    url: props.url || window.location.href,
    image: props.image,
    author: {
      '@type': 'Organization',
      name: props.author
    }
  }

  if (props.type === 'article') {
    Object.assign(data, {
      datePublished: props.publishedAt,
      dateModified: props.modifiedAt || props.publishedAt
    })
  }

  return JSON.stringify(data)
})

// Update meta tags
const updateMetaTags = () => {
  // Title
  document.title = props.title

  // Meta description
  let metaDescription = document.querySelector('meta[name="description"]')
  if (!metaDescription) {
    metaDescription = document.createElement('meta')
    metaDescription.setAttribute('name', 'description')
    document.head.appendChild(metaDescription)
  }
  metaDescription.setAttribute('content', props.description)

  // Open Graph
  const ogTags = {
    'og:title': props.title,
    'og:description': props.description,
    'og:image': props.image,
    'og:url': props.url || window.location.href,
    'og:type': props.type
  }

  Object.entries(ogTags).forEach(([property, content]) => {
    let meta = document.querySelector(`meta[property="${property}"]`)
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('property', property)
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', content)
  })

  // Twitter Card
  const twitterTags = {
    'twitter:card': 'summary_large_image',
    'twitter:title': props.title,
    'twitter:description': props.description,
    'twitter:image': props.image
  }

  Object.entries(twitterTags).forEach(([name, content]) => {
    let meta = document.querySelector(`meta[name="${name}"]`)
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', name)
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', content)
  })
}

// Update meta tags when component is mounted
onMounted(() => {
  updateMetaTags()
})

// Update meta tags when props change
watch(
  () => [props.title, props.description, props.image, props.url, props.type],
  () => {
    updateMetaTags()
  }
)
</script> 