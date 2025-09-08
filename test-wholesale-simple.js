// Simple test for wholesale endpoint
const API_BASE_URL = 'http://localhost:3003/api';

async function testWholesaleEndpoint() {
  try {
    console.log('Testing wholesale endpoint...');
    
    // First, get a product to test with
    const productsResponse = await fetch(`${API_BASE_URL}/products/all`);
    const products = await productsResponse.json();
    
    if (products.length === 0) {
      console.log('❌ No products found');
      return;
    }
    
    const testProduct = products[0];
    console.log(`Testing with product: ${testProduct.nombre} (ID: ${testProduct.id})`);
    console.log('Current state:', {
      mayorista: testProduct.mayorista,
      mayoristaPrice: testProduct.mayoristaPrice,
      precio: testProduct.precio
    });
    
    // Test updating to wholesale
    console.log('\n1. Updating product to wholesale...');
    const updateResponse = await fetch(`${API_BASE_URL}/products/${testProduct.id}/wholesale`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mayorista: true,
        mayoristaPrice: 150.00,
      }),
    });
    
    if (updateResponse.ok) {
      const updatedProduct = await updateResponse.json();
      console.log('✅ Product updated successfully');
      console.log('Updated state:', {
        mayorista: updatedProduct.mayorista,
        mayoristaPrice: updatedProduct.mayoristaPrice,
        precio: updatedProduct.precio
      });
    } else {
      const errorText = await updateResponse.text();
      console.log('❌ Failed to update product');
      console.log('Status:', updateResponse.status);
      console.log('Error:', errorText);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testWholesaleEndpoint();
