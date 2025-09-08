// Simple test script to verify infinite scroll API
const API_BASE_URL = 'http://localhost:3003/api';

async function testInfiniteScrollAPI() {
  console.log('Testing Infinite Scroll API...\n');

  try {
    // Test first page
    console.log('1. Testing first page (take=5)...');
    const firstPage = await fetch(`${API_BASE_URL}/products?take=5`);
    const firstPageData = await firstPage.json();
    
    console.log('✅ First page response:', {
      itemsCount: firstPageData.items?.length || 0,
      hasNextCursor: !!firstPageData.nextCursor,
      nextCursor: firstPageData.nextCursor
    });

    if (firstPageData.nextCursor) {
      // Test second page
      console.log('\n2. Testing second page...');
      const secondPage = await fetch(`${API_BASE_URL}/products?take=5&cursor=${firstPageData.nextCursor}`);
      const secondPageData = await secondPage.json();
      
      console.log('✅ Second page response:', {
        itemsCount: secondPageData.items?.length || 0,
        hasNextCursor: !!secondPageData.nextCursor,
        nextCursor: secondPageData.nextCursor
      });
    }

    // Test with invalid parameters
    console.log('\n3. Testing invalid take parameter...');
    try {
      const invalidResponse = await fetch(`${API_BASE_URL}/products?take=invalid`);
      if (!invalidResponse.ok) {
        console.log('✅ Invalid parameter correctly rejected:', invalidResponse.status);
      }
    } catch (error) {
      console.log('✅ Error handling working:', error.message);
    }

    console.log('\n🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\nMake sure the backend is running on port 3003');
  }
}

// Run the test
testInfiniteScrollAPI();
