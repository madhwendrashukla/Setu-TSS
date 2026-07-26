async function runTest() {
  console.log("Starting Form Structure Part-Count Constraint Verification Test...");
  const url = 'http://localhost:5000/api/helpdesk';
  
  try {
    const formData = new FormData();
    formData.append('email', 'test@test.com');
    formData.append('message', 'Test message');
    
    // Attempt to inject 50 extra metadata text fields (over the 20 field limit)
    for (let i = 0; i < 50; i++) {
      formData.append(`injected_field_${i}`, `malicious_data_${i}`);
    }
    
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    
    console.log(`HTTP Status Code: ${response.status}`);
    
    const data = await response.json().catch(() => null);
    
    if (response.status === 400) {
      console.log('✅ TEST PASSED: The endpoint safely rejected the out-of-boundary field count and returned a controlled 400 Bad Request.');
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
