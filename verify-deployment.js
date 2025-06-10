#!/usr/bin/env node

// Quick deployment verification script for DripCheck
const https = require('https');
const http = require('http');

console.log('🔍 DripCheck Deployment Verification\n');

// Test endpoints
const tests = [
  {
    name: 'Local Backend Health',
    url: 'http://localhost:5000/api/outfits',
    expected: 200
  },
  {
    name: 'Local Frontend',
    url: 'http://localhost:5174',
    expected: 200
  }
];

async function testEndpoint(test) {
  return new Promise((resolve) => {
    const client = test.url.startsWith('https') ? https : http;
    
    const req = client.get(test.url, (res) => {
      console.log(`✅ ${test.name}: ${res.statusCode} ${res.statusMessage}`);
      resolve(res.statusCode === test.expected);
    });

    req.on('error', (err) => {
      console.log(`❌ ${test.name}: ${err.message}`);
      resolve(false);
    });

    req.setTimeout(5000, () => {
      console.log(`⏰ ${test.name}: Timeout`);
      req.destroy();
      resolve(false);
    });
  });
}

async function runTests() {
  console.log('Testing local services...\n');
  
  let passed = 0;
  for (const test of tests) {
    const success = await testEndpoint(test);
    if (success) passed++;
  }
  
  console.log(`\n📊 Results: ${passed}/${tests.length} tests passed\n`);
  
  if (passed === tests.length) {
    console.log('🎉 All tests passed! Ready for deployment.\n');
    console.log('Next steps:');
    console.log('1. Fix MongoDB Atlas IP whitelist');
    console.log('2. Deploy frontend to Vercel');
    console.log('3. Deploy backend to Railway');
    console.log('4. Update environment variables');
    console.log('5. Test production URLs\n');
  } else {
    console.log('❌ Some tests failed. Fix local issues before deploying.\n');
  }
}

runTests();
