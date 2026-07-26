function runTest() {
  console.log("Starting Next.js Link Protocol Prefix Sanitization Test...");

  const sanitizeExternalUrl = (url) => {
    if (!url || url === "#") return "#";
    return /^https?:\/\//i.test(url) ? url : `https://${url}`;
  };

  const rawDatabaseEntries = [
    "www.google.com",
    "http://setu.in",
    "https://example.com/register",
    "forms.gle/xyz123"
  ];

  console.log("\nSimulating Gallery Component Render...");
  let failedPrefetches = 0;

  rawDatabaseEntries.forEach(rawUrl => {
    const sanitizedUrl = sanitizeExternalUrl(rawUrl);
    
    // In Next.js, if the href doesn't start with http/https, it assumes it's an internal route
    // and attempts to prefetch the _next/data JSON for it.
    const wouldTriggerPrefetch = !sanitizedUrl.startsWith('http://') && !sanitizedUrl.startsWith('https://');
    
    if (wouldTriggerPrefetch) failedPrefetches++;

    console.log(`Input: ${rawUrl.padEnd(30)} -> Output: ${sanitizedUrl.padEnd(35)} | Triggers Prefetch Loop: ${wouldTriggerPrefetch ? '❌ YES' : '✅ NO'}`);
  });

  if (failedPrefetches === 0) {
    console.log('\n✅ TEST PASSED: All external URLs are safely prefixed. Next.js will safely identify them as external destinations and suspend automated prefetching.');
  } else {
    console.log('\n❌ TEST FAILED: Some URLs are still vulnerable to the prefetch loop flaw.');
  }
}

runTest();
