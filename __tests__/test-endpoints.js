const http = require('http');
const fs = require('fs');

// Test results will be written to this file
const resultsFile = 'endpoint-test-results.txt';
let results = [];

function writeResult(test, result) {
    results.push(`${test}: ${result}`);
    fs.writeFileSync(resultsFile, results.join('\n'));
}

function makeRequest(options, data, testName) {
    return new Promise((resolve) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                const result = `Status: ${res.statusCode}, Body: ${body}`;
                writeResult(testName, result);
                resolve({ status: res.statusCode, body });
            });
        });

        req.on('error', (err) => {
            writeResult(testName, `Error: ${err.message}`);
            resolve({ error: err.message });
        });

        if (data) {
            req.write(data);
        }
        req.end();
    });
}

async function testEndpoints() {
    writeResult('Starting Tests', new Date().toISOString());

    // Test 1: Health check
    await makeRequest({
        hostname: 'localhost',
        port: 3000,
        path: '/health',
        method: 'GET'
    }, null, 'Health Check');

    // Test 2: Perspectives endpoint
    await makeRequest({
        hostname: 'localhost',
        port: 3000,
        path: '/api/perspectives/climate-change',
        method: 'GET'
    }, null, 'Perspectives Endpoint');

    // Test 3: Feedback endpoint (should fail without auth)
    await makeRequest({
        hostname: 'localhost',
        port: 3000,
        path: '/api/feedback',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }, JSON.stringify({
        analysisId: 'test123',
        rating: 4,
        comment: 'Test feedback'
    }), 'Feedback Endpoint (No Auth)');

    writeResult('Tests Completed', new Date().toISOString());
}

// Wait a bit for server to start, then run tests
setTimeout(testEndpoints, 3000);
