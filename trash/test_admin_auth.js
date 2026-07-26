async function runTest() {
  console.log("Starting Unauthenticated Admin Route Protection Test...");
  const url = 'http://localhost:3000/admin/events';
  
  try {
    // We set redirect: 'manual' to catch the 307 before fetch automatically follows it
    const response = await fetch(url, { redirect: 'manual' });
    
    console.log(`HTTP Status Code: ${response.status}`);
    
    // We expect a redirect (307/308 in Next.js middleware) from the edge router
    if (response.status >= 300 && response.status < 400) {
      console.log('✅ TEST PASSED: Server successfully intercepted the unauthenticated request at the edge and redirected it.');
      console.log(`Redirect Location: ${response.headers.get('location')}`);
    } else if (response.status === 200) {
      console.log('❌ TEST FAILED: Server responded with 200 OK, improperly serving the SPA layout shell.');
    } else {
      console.log(`❌ TEST FAILED: Server responded with unexpected status ${response.status}.`);
    }
  } catch (err) {
    console.error('❌ TEST ERRORED (Make sure the Next.js frontend is running on port 3000):', err.message);
  }
}

runTest();
