import autocannon from 'autocannon';

describe('Performance Testing', () => {
  it('should handle load on /api/analysis/analyze endpoint', (done) => {
    const url = 'http://localhost:3000/api/analysis/analyze';

    const instance = autocannon({
      url,
      method: 'POST',
      connections: 50, // concurrent connections
      duration: 10, // test duration in seconds
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer testtoken' // replace with valid token if needed
      },
      body: JSON.stringify({
        text: 'This is a test text for bias analysis performance testing.'
      })
    });

    autocannon.track(instance, { renderProgressBar: true });

    instance.on('done', (result) => {
      console.log('Performance test results:', result);
      expect(result.errors).toBe(0);
      expect(result['2xx']).toBeGreaterThan(0);
      done();
    });
  });
});
