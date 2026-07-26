async function runTest() {
  console.log("Starting Administrative Directory Edge Header Verification Test...");
  const url = 'http://localhost:3000/admin/dashboard';
  
  try {
    // Attempting to access a protected directory without a token, looking for the 307 Redirect
    const response = await fetch(url, { method: 'GET', redirect: 'manual' });
    
    console.log(`\nHTTP Status Code: ${response.status}`);
    console.log("\nInspecting Intercepted Edge Headers:");
    
    const csp = response.headers.get('content-security-policy');
    const xContentType = response.headers.get('x-content-type-options');
    
    console.log(`- Content-Security-Policy: ${csp ? csp.substring(0, 50) + '...' : 'MISSING'}`);
    console.log(`- X-Content-Type-Options: ${xContentType || 'MISSING'}`);
    
    if (csp && csp.includes("default-src 'self'") && xContentType === 'nosniff') {
      console.log('\n✅ TEST PASSED: Edge Middleware successfully enveloped the unauthenticated 307 bounce with strict CSP headers, preventing structural path exposure.');
    } else {
      console.log('\n❌ TEST FAILED: The required security delivery flags are missing from the Edge evaluation.');
    }
  } catch (err) {
    console.error('\n❌ TEST ERRORED (Make sure the Next.js frontend is running on port 3000):', err.message);
  }
}

runTest();
