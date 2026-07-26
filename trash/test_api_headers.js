async function runTest() {
  console.log("Starting API Response Hardening & Header Verification Test...");
  const url = 'http://localhost:5000/api/helpdesk';
  
  try {
    // Send a simple GET request to any endpoint just to read the global headers
    const response = await fetch(url, { method: 'OPTIONS' });
    
    console.log(`\nHTTP Status Code: ${response.status}`);
    console.log("\nInspecting Response Headers:");
    
    const csp = response.headers.get('content-security-policy');
    const xContentType = response.headers.get('x-content-type-options');
    const xFrameOptions = response.headers.get('x-frame-options');
    
    console.log(`- Content-Security-Policy: ${csp || 'MISSING'}`);
    console.log(`- X-Content-Type-Options: ${xContentType || 'MISSING'}`);
    console.log(`- X-Frame-Options: ${xFrameOptions || 'MISSING'}`);
    
    if (csp && csp.includes("default-src 'none'") && xContentType === 'nosniff') {
      console.log('\n✅ TEST PASSED: Backend API successfully deployed hardened HTTP response headers, preventing invalid execution boundaries.');
    } else {
      console.log('\n❌ TEST FAILED: The required security delivery flags are missing from the response.');
    }
  } catch (err) {
    console.error('\n❌ TEST ERRORED (Make sure the backend is running on port 5000):', err.message);
  }
}

runTest();
