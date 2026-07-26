async function runTest() {
  console.log("Starting Lead Capture Widget Input Boundary Validation Test...");
  const url = 'http://localhost:5000/api/leads';
  
  try {
    const payload = {
      name: "John Doe",
      email: "test@example.com",
      city: "New York <script>alert(1)</script> [@malicious$]",
      message: "Hello world"
    };
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const data = await response.json().catch(() => null);
    console.log(`\nHTTP Status Code: ${response.status}`);
    
    if (response.status === 400 && data?.error?.includes('invalid special characters')) {
      console.log('\n✅ TEST PASSED: The backend API successfully intercepted the special character payload, rejected the data, and returned a strict 400 Validation Error.');
      console.log(`Response Error Message: ${data.error}`);
    } else if (response.status === 200 || response.status === 201) {
      console.log('\n❌ TEST FAILED: The payload was processed and saved without validation errors, risking Stored XSS.');
    } else {
      console.log(`\n❌ TEST FAILED: Server responded with unexpected status ${response.status}.`);
    }
  } catch (err) {
    console.error('\n❌ TEST ERRORED (Make sure the backend is running on port 5000):', err.message);
  }
}

runTest();
