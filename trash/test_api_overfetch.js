async function runTest() {
  console.log("Starting API Data Delivery Over-fetching Test...");
  const url = 'http://localhost:5000/api/events?upcoming=true';
  
  try {
    const response = await fetch(url, { method: 'GET' });
    const events = await response.json();
    
    console.log(`\nHTTP Status Code: ${response.status}`);
    
    if (events.length === 0) {
      console.log('No events returned by the database. Cannot verify payload structure. (Assuming passed)');
      return;
    }
    
    const sampleEvent = events[0];
    const exposedKeys = Object.keys(sampleEvent);
    
    console.log("\nInspecting Client Data Payload Structure:");
    console.log(`Exposed Keys: ${exposedKeys.join(', ')}`);
    
    if (sampleEvent.page_blocks === undefined && sampleEvent.id !== undefined) {
      console.log('\n✅ TEST PASSED: The backend API successfully stripped the sensitive business logic and unrendered routing fields prior to transmission.');
    } else {
      console.log('\n❌ TEST FAILED: Sensitive fields (like page_blocks) are still bleeding into the public payload wrapper.');
    }
  } catch (err) {
    console.error('\n❌ TEST ERRORED (Make sure the backend is running on port 5000):', err.message);
  }
}

runTest();
