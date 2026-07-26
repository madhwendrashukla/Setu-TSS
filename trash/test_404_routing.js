async function runTest() {
  console.log("Starting Next.js Catch-All Component Router 404 Status Test...");
  const url = 'http://localhost:3000/events/this-event-does-not-exist';
  
  try {
    const response = await fetch(url, { method: 'GET' });
    
    console.log(`\nHTTP Status Code: ${response.status}`);
    
    if (response.status === 404) {
      console.log('\n✅ TEST PASSED: The dynamic component successfully threw a network-level 404 Not Found response, preventing cache optimization pollution.');
    } else if (response.status === 200) {
      console.log('\n❌ TEST FAILED: The server returned a 200 OK header for a non-existent parameter, which will pollute the Edge caching tier.');
    } else {
      console.log(`\n❌ TEST FAILED: Unexpected status code ${response.status}.`);
    }
  } catch (err) {
    console.error('\n❌ TEST ERRORED (Make sure the frontend is running on port 3000):', err.message);
  }
}

runTest();
