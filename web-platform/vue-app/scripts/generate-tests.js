const fs = require('fs')
const path = require('path')
const glob = require('glob')

// Paths
const COMPONENTS_DIR = path.join(__dirname, '../src/components')
const TEMPLATE_PATH = path.join(__dirname, 'templates/component-test.template.ts')
const TEST_DIR = path.join(__dirname, '../tests/unit')

// Ensure test directory exists
if (!fs.existsSync(TEST_DIR)) {
  fs.mkdirSync(TEST_DIR, { recursive: true })
}

// Read test template
const template = fs.readFileSync(TEMPLATE_PATH, 'utf8')

// Extract props and emits using regex
function extractPropsAndEmits(content) {
  const props = {}
  const emits = {}

  // Extract props
  const propsMatch = content.match(/interface Props {([^}]*)}/s)
  if (propsMatch) {
    const propsContent = propsMatch[1]
    const propLines = propsContent.split('\n')
    propLines.forEach(line => {
      const match = line.match(/(\w+):\s*([^;]+);/g)
      if (match) {
        props[match[1]] = match[2].trim()
      }
    })
  }

  // Extract emits
  const emitsMatch = content.match(/defineEmits<{([^}]*)}>/s)
  if (emitsMatch) {
    const emitsContent = emitsMatch[1]
    const emitLines = emitsContent.split('\n')
    emitLines.forEach(line => {
      const match = line.match(/(\w+):\s*([^;]+);/g)
      if (match) {
        emits[match[1]] = match[2].trim()
      }
    })
  }

  return { props, emits }
}

// Generate test content
function generateTestContent(componentName, props, emits) {
  let content = template

  // Replace component name
  content = content.replace(/ComponentName/g, componentName)

  // Generate props object
  const propsObject = Object.entries(props)
    .map(([key, type]) => `    ${key}: ${type}`)
    .join(',\n')
  content = content.replace(
    /\/\/ Add your component's props here/,
    propsObject || '    // No props defined'
  )

  // Generate events object
  const eventsObject = Object.entries(emits)
    .map(([key, type]) => `    ${key}: ${type}`)
    .join(',\n')
  content = content.replace(
    /\/\/ Add your component's events here/,
    eventsObject || '    // No events defined'
  )

  return content
}

// Process a component file
function processComponent(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  const componentName = path.basename(filePath, '.vue')
  const { props, emits } = extractPropsAndEmits(content)

  const testContent = generateTestContent(componentName, props, emits)
  const testFilePath = path.join(TEST_DIR, `${componentName}.spec.ts`)

  // Check if test file already exists
  if (fs.existsSync(testFilePath)) {
    console.log(`⚠️  Test file already exists for ${componentName}`)
    return
  }

  // Write test file
  fs.writeFileSync(testFilePath, testContent)
  console.log(`✅ Generated test for ${componentName}`)
}

// Main function
function generateTests() {
  console.log('Generating component tests...\n')

  // Find all Vue components
  const components = glob.sync('**/*.vue', {
    cwd: COMPONENTS_DIR,
    absolute: true
  })

  if (components.length === 0) {
    console.log('No Vue components found!')
    return
  }

  // Process each component
  components.forEach(processComponent)

  console.log('\nTest generation complete!')
}

// Run the generator
generateTests() 