async function runTest() {
  console.log("Starting Multi-Part Character Volume Buffer Ingestion Test...");
  const url = 'http://localhost:5000/api/helpdesk';
  
  try {
    // Generate a massive 500,000 character string
    const massiveString = 'A'.repeat(500000);
    
    const formData = new FormData();
    formData.append('email', 'test@test.com');
    formData.append('message', massiveString);
    
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    
    console.log(`HTTP Status Code: ${response.status}`);
    
    const data = await response.json().catch(() => null);
    
    if (response.status === 400) {
      console.log('✅ TEST PASSED: The endpoint safely intercepted the out-of-boundary string and returned a controlled 400 Bad Request.');
      console.log(`Response Error Message: ${data?.error}`);
    } else if (response.status === 500) {
      console.log('❌ TEST FAILED: Server crashed or threw an unhandled 500 internal server error.');
    } else {
      console.log(`❌ TEST FAILED: Server responded with unexpected status ${response.status}.`);
    }
  } catch (err) {
    console.error('❌ TEST ERRORED (Make sure the backend is running on port 5000):', err.message);
  }
}

runTest();
