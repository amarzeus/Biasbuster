// Simple test script to check if the perspectives API is working
const fetch = require('node-fetch');

async function testPerspectivesAPI() {
    const url = 'http://localhost:8080/api/v1/perspectives';
    const testData = {
        text: "The government's new policy on healthcare has been criticized by many experts.",
        topic: "Healthcare Policy"
    };

    try {
        console.log('Testing Alternative Perspectives API...');
        console.log(`Sending request to: ${url}`);
        console.log(`With data:`, JSON.stringify(testData, null, 2));
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testData)
        });

        const data = await response.json();
        
        console.log('\nAPI Response:', JSON.stringify(data, null, 2));
        
        if (response.ok) {
            console.log('\n✅ API test successful!');
            if (data.data && data.data.length > 0) {
                console.log(`Received ${data.data.length} alternative perspectives.`);
            }
        } else {
            console.log('\n❌ API test failed.');
        }
    } catch (error) {
        console.error('\n❌ Error:', error.message);
    }
}

testPerspectivesAPI(); 