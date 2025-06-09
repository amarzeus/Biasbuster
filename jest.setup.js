// Import Jest DOM matchers
import '@testing-library/jest-dom';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
class IntersectionObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserver,
});

// Mock ResizeObserver
class ResizeObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: ResizeObserver,
});

// Mock chrome API for extension tests
const chrome = {
  runtime: {
    sendMessage: jest.fn(),
    onMessage: {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    },
    getURL: jest.fn(),
  },
  storage: {
    sync: {
      get: jest.fn(),
      set: jest.fn(),
      clear: jest.fn(),
    },
  },
  tabs: {
    query: jest.fn(),
    sendMessage: jest.fn(),
  },
};

Object.defineProperty(window, 'chrome', {
  writable: true,
  value: chrome,
});

// Mock fetch API
global.fetch = jest.fn();

// Mock console methods
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn(),
};

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

// Mock requestAnimationFrame
global.requestAnimationFrame = callback => setTimeout(callback, 0);
global.cancelAnimationFrame = id => clearTimeout(id);

// Mock performance API
global.performance = {
  ...window.performance,
  now: jest.fn(),
};

// Mock URL API
global.URL.createObjectURL = jest.fn();
global.URL.revokeObjectURL = jest.fn();

// Mock FileReader
class FileReader {
  readAsDataURL = jest.fn();
  readAsText = jest.fn();
  readAsArrayBuffer = jest.fn();
  abort = jest.fn();
}

Object.defineProperty(window, 'FileReader', {
  writable: true,
  value: FileReader,
});

// Mock canvas
HTMLCanvasElement.prototype.getContext = jest.fn();

// Mock WebGL
const getContext = jest.fn();
HTMLCanvasElement.prototype.getContext = getContext;

// Mock WebGLRenderingContext
class WebGLRenderingContext {
  createBuffer = jest.fn();
  createProgram = jest.fn();
  createShader = jest.fn();
  shaderSource = jest.fn();
  compileShader = jest.fn();
  attachShader = jest.fn();
  linkProgram = jest.fn();
  useProgram = jest.fn();
  getAttribLocation = jest.fn();
  getUniformLocation = jest.fn();
  uniformMatrix4fv = jest.fn();
  vertexAttribPointer = jest.fn();
  enableVertexAttribArray = jest.fn();
  drawArrays = jest.fn();
}

Object.defineProperty(window, 'WebGLRenderingContext', {
  writable: true,
  value: WebGLRenderingContext,
});

// Mock AudioContext
class AudioContext {
  createBuffer = jest.fn();
  createBufferSource = jest.fn();
  createGain = jest.fn();
  createOscillator = jest.fn();
  createAnalyser = jest.fn();
  createBiquadFilter = jest.fn();
  createConvolver = jest.fn();
  createDelay = jest.fn();
  createDynamicsCompressor = jest.fn();
  createMediaElementSource = jest.fn();
  createMediaStreamDestination = jest.fn();
  createMediaStreamSource = jest.fn();
  createPanner = jest.fn();
  createPeriodicWave = jest.fn();
  createScriptProcessor = jest.fn();
  createStereoPanner = jest.fn();
  createWaveShaper = jest.fn();
  decodeAudioData = jest.fn();
  resume = jest.fn();
  suspend = jest.fn();
  close = jest.fn();
}

Object.defineProperty(window, 'AudioContext', {
  writable: true,
  value: AudioContext,
});

// Mock WebSocket
class WebSocket {
  constructor() {
    setTimeout(() => this.onopen(), 0);
  }
  send = jest.fn();
  close = jest.fn();
  onopen = jest.fn();
  onclose = jest.fn();
  onmessage = jest.fn();
  onerror = jest.fn();
}

Object.defineProperty(window, 'WebSocket', {
  writable: true,
  value: WebSocket,
});

// Mock Notification
class Notification {
  constructor() {}
  static requestPermission = jest.fn();
  static permission = 'granted';
}

Object.defineProperty(window, 'Notification', {
  writable: true,
  value: Notification,
});

// Mock ServiceWorker
class ServiceWorker {
  postMessage = jest.fn();
  addEventListener = jest.fn();
  removeEventListener = jest.fn();
}

Object.defineProperty(window, 'ServiceWorker', {
  writable: true,
  value: ServiceWorker,
});

// Mock ServiceWorkerRegistration
class ServiceWorkerRegistration {
  unregister = jest.fn();
  update = jest.fn();
}

Object.defineProperty(window, 'ServiceWorkerRegistration', {
  writable: true,
  value: ServiceWorkerRegistration,
});

// Mock ServiceWorkerContainer
class ServiceWorkerContainer {
  register = jest.fn();
  getRegistration = jest.fn();
  getRegistrations = jest.fn();
  startMessages = jest.fn();
}

Object.defineProperty(window, 'navigator', {
  writable: true,
  value: {
    ...window.navigator,
    serviceWorker: new ServiceWorkerContainer(),
  },
}); 