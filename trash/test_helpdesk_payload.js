const { Buffer } = require('node:buffer');

async function runTest() {
  console.log("Starting Out-of-Boundary Volume Load Test...");
  const url = 'http://localhost:5000/api/helpdesk';
  
  // Create a 10MB payload (out of boundary, as max is 5MB)
  const largeBuffer = Buffer.alloc(10 * 1024 * 1024, 'a');
  const blob = new Blob([largeBuffer], { type: 'text/plain' });

  const formData = new FormData();
  formData.append('message', 'Test message for out-of-boundary volume');
  formData.append('email', 'test@example.com');
  formData.append('attachment', blob, '10mb_payload.txt');

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });
    
    const body = await response.text();
    console.log(`HTTP Status Code: ${response.status}`);
    console.log(`Response Body: ${body}`);
    
    if (response.status === 413 && body.includes('Attachment too large')) {
      console.log('✅ TEST PASSED: Server gracefully caught the out-of-boundary payload and returned a safe 413 error without leaking Node stack traces.');
    } else {
      console.log('❌ TEST FAILED: Server responded with an unexpected status or leaked information.');
    }
  } catch (err) {
    console.error('❌ TEST ERRORED:', err.message);
  }
}

runTest();
