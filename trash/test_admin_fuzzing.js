async function runTest() {
  console.log("Starting Non-Existent Protected Path Character Injection Fuzzing Test...");
  
  // A path specifically designed to bypass basic path-to-regexp matchers
  const url = 'http://localhost:3000/admin/%40%23%24%25%5E%26%2A%28%29%2B.jsx';
  
  try {
    const response = await fetch(url, { redirect: 'manual' });
    
    console.log(`HTTP Status Code: ${response.status}`);
    
    if (response.status >= 300 && response.status < 400) {
      console.log('✅ TEST PASSED: Middleware successfully intercepted the malformed URL and redirected the user before rendering the Next.js 404 error boundary.');
      console.log(`Redirect Location: ${response.headers.get('location')}`);
    } else if (response.status === 404) {
      console.log('❌ TEST FAILED: Server bypassed middleware and returned a 404, exposing the custom error layout framework.');
    } else {
      console.log(`❌ TEST FAILED: Server responded with unexpected status ${response.status}.`);
    }
  } catch (err) {
    console.error('❌ TEST ERRORED (Make sure the Next.js frontend is running on port 3000):', err.message);
  }
}

runTest();
