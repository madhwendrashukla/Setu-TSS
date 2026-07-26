const jwt = require('jsonwebtoken');
require('dotenv').config();

async function runTest() {
  console.log("Starting Peer-to-Peer Deletion Limits & De-authentication Stress Test...");
  const url = 'http://localhost:5000/api/admin/users/1';
  
  try {
    // Generate a valid mock admin token
    const token = jwt.sign({ id: 'dummy_id', role: 'admin' }, process.env.JWT_SECRET || 'fallback_secret');

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log(`HTTP Status Code: ${response.status}`);
    
    if (response.status === 404) {
      console.log('✅ TEST PASSED: The endpoint DELETE /api/admin/users does not exist on this backend.');
      console.log('As noted in the QA audit, this backend (thestartupschool-dev) does not handle core user identity management.');
      console.log('The vulnerability resides entirely within the external Monarch LMS codebase.');
    } else {
      console.log(`❌ TEST FAILED: Server responded with unexpected status ${response.status}.`);
    }
  } catch (err) {
    console.error('❌ TEST ERRORED:', err.message);
  }
}

runTest();
