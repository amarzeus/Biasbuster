const autocannon = require('autocannon');

describe('Performance Tests', () => {
  const baseURL = 'http://localhost:3000';
  
  test('API health endpoint performance', async () => {
    const result = await autocannon({
      url: `${baseURL}/health`,
      connections: 10,
      duration: 10,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    expect(result.errors).toBe(0);
    expect(result.timeouts).toBe(0);
    expect(result.non2xx).toBe(0);
    expect(result.requests.average).toBeGreaterThan(100); // At least 100 req/sec
  }, 30000);

  test('Analysis endpoint performance under load', async () => {
    // First register and login to get auth token
    const authResponse = await fetch(`${baseURL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'perf@example.com',
        password: 'testpassword123',
        name: 'Performance User'
      })
    });
    
    const authData = await authResponse.json();
    const token = authData.token;

    const result = await autocannon({
      url: `${baseURL}/api/analysis/analyze`,
      method: 'POST',
      connections: 5,
      duration: 10,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        text: 'This is a test article for performance testing of bias analysis.'
      })
    });

    expect(result.errors).toBe(0);
    expect(result.timeouts).toBe(0);
    expect(result.non2xx).toBe(0);
    expect(result.latency.average).toBeLessThan(5000); // Less than 5 seconds average
  }, 60000);

  test('Static file serving performance', async () => {
    const result = await autocannon({
      url: `${baseURL}/`,
      connections: 20,
      duration: 10
    });

    expect(result.errors).toBe(0);
    expect(result.timeouts).toBe(0);
    expect(result.non2xx).toBe(0);
    expect(result.requests.average).toBeGreaterThan(200); // At least 200 req/sec for static files
  }, 30000);

  test('Memory usage stays within bounds', async () => {
    const initialMemory = process.memoryUsage();
    
    // Simulate load
    const promises = [];
    for (let i = 0; i < 100; i++) {
      promises.push(
        fetch(`${baseURL}/health`)
          .then(response => response.json())
      );
    }
    
    await Promise.all(promises);
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }
    
    const finalMemory = process.memoryUsage();
    const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;
    
    // Memory increase should be reasonable (less than 50MB)
    expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
  }, 30000);

  test('Concurrent user simulation', async () => {
    const concurrentUsers = 10;
    const requestsPerUser = 5;
    
    const userPromises = [];
    
    for (let user = 0; user < concurrentUsers; user++) {
      const userPromise = async () => {
        const userRequests = [];
        
        for (let req = 0; req < requestsPerUser; req++) {
          userRequests.push(
            fetch(`${baseURL}/health`)
              .then(response => response.json())
          );
        }
        
        return Promise.all(userRequests);
      };
      
      userPromises.push(userPromise());
    }
    
    const startTime = Date.now();
    const results = await Promise.all(userPromises);
    const endTime = Date.now();
    
    const totalRequests = concurrentUsers * requestsPerUser;
    const duration = (endTime - startTime) / 1000;
    const requestsPerSecond = totalRequests / duration;
    
    expect(results).toHaveLength(concurrentUsers);
    expect(requestsPerSecond).toBeGreaterThan(50); // At least 50 req/sec
  }, 30000);
});
