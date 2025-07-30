// Enhanced test script for album deletion functionality
// Tests both single and bulk deletion with performance metrics

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000/api/v1/admin'; // Adjust port as needed

async function testSingleAlbumDeletion() {
  try {
    console.log('🧪 Testing Single Album Deletion Functionality\n');

    // 1. Get all albums first
    console.log('📋 Fetching all albums...');
    const albumsResponse = await fetch(`${BASE_URL}/album`);
    const albumsData = await albumsResponse.json();
    
    if (albumsData.error) {
      console.error('❌ Error fetching albums:', albumsData.message);
      return;
    }

    console.log(`✅ Found ${albumsData.data.length} albums`);
    
    if (albumsData.data.length === 0) {
      console.log('⚠️  No albums found. Create some test albums first.');
      return;
    }

    // 2. Show album details
    albumsData.data.forEach((album, index) => {
      console.log(`\n📁 Album ${index + 1}:`);
      console.log(`   ID: ${album._id}`);
      console.log(`   Title: ${album.title}`);
      console.log(`   Images: ${album.images.length}`);
    });

    // 3. Select album to delete
    const albumToDelete = albumsData.data[0]; // Delete first album for testing
    
    if (!albumToDelete) {
      console.log('⚠️  No album selected for deletion');
      return;
    }

    console.log(`\n🗑️  Attempting to delete album: "${albumToDelete.title}" (${albumToDelete._id})`);
    console.log(`   This album has ${albumToDelete.images.length} images`);

    // 4. Measure performance
    const startTime = Date.now();

    // 5. Delete the album
    const deleteResponse = await fetch(`${BASE_URL}/delete/albums/${albumToDelete._id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const deleteResult = await deleteResponse.json();
    const endTime = Date.now();
    const duration = endTime - startTime;

    if (deleteResult.error) {
      console.error('❌ Deletion failed:', deleteResult.message);
      return;
    }

    // 6. Show deletion results
    console.log('\n✅ Album deletion completed!');
    console.log(`⏱️  Deletion took: ${duration}ms`);
    console.log('📊 Deletion Summary:');
    console.log(`   Album deleted: ${deleteResult.deletionSummary.albumDeleted}`);
    console.log(`   Total images: ${deleteResult.deletionSummary.totalImages}`);
    console.log(`   Images deleted from DB: ${deleteResult.deletionSummary.imagesDeletedFromDB}`);
    console.log(`   Images deleted from Cloudinary: ${deleteResult.deletionSummary.imagesDeletedFromCloudinary}`);
    
    if (deleteResult.deletionSummary.cloudinaryErrors.length > 0) {
      console.log('\n⚠️  Cloudinary Errors:');
      deleteResult.deletionSummary.cloudinaryErrors.forEach((error, index) => {
        console.log(`   ${index + 1}. Image ID: ${error.imageId}`);
        console.log(`      Public ID: ${error.publicId}`);
        console.log(`      Error: ${error.error}`);
      });
    }

    // 7. Verify deletion by fetching albums again
    console.log('\n🔍 Verifying deletion...');
    const verifyResponse = await fetch(`${BASE_URL}/album`);
    const verifyData = await verifyResponse.json();
    
    const albumStillExists = verifyData.data.find(album => album._id === albumToDelete._id);
    
    if (albumStillExists) {
      console.log('❌ Album still exists in database!');
    } else {
      console.log('✅ Album successfully removed from database');
    }

    console.log(`📊 Albums remaining: ${verifyData.data.length}`);

  } catch (error) {
    console.error('💥 Single deletion test failed:', error.message);
  }
}

async function testBulkAlbumDeletion() {
  try {
    console.log('\n\n🚀 Testing Bulk Album Deletion Functionality\n');

    // 1. Get all albums
    console.log('📋 Fetching all albums...');
    const albumsResponse = await fetch(`${BASE_URL}/album`);
    const albumsData = await albumsResponse.json();
    
    if (albumsData.error) {
      console.error('❌ Error fetching albums:', albumsData.message);
      return;
    }

    console.log(`✅ Found ${albumsData.data.length} albums`);
    
    if (albumsData.data.length < 2) {
      console.log('⚠️  Need at least 2 albums for bulk deletion test.');
      return;
    }

    // 2. Select multiple albums for deletion (first 2 for testing)
    const albumsToDelete = albumsData.data.slice(0, Math.min(2, albumsData.data.length));
    const albumIds = albumsToDelete.map(album => album._id);

    console.log(`\n🗑️  Attempting bulk deletion of ${albumIds.length} albums:`);
    albumsToDelete.forEach((album, index) => {
      console.log(`   ${index + 1}. "${album.title}" (${album.images.length} images)`);
    });

    // 3. Measure performance
    const startTime = Date.now();

    // 4. Perform bulk deletion
    const deleteResponse = await fetch(`${BASE_URL}/delete/albums`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ albumIds })
    });

    const deleteResult = await deleteResponse.json();
    const endTime = Date.now();
    const duration = endTime - startTime;

    if (deleteResult.error) {
      console.error('❌ Bulk deletion failed:', deleteResult.message);
      return;
    }

    // 5. Show bulk deletion results
    console.log('\n✅ Bulk deletion completed!');
    console.log(`⏱️  Bulk deletion took: ${duration}ms`);
    console.log('📊 Bulk Deletion Summary:');
    console.log(`   Albums requested: ${deleteResult.bulkResults.totalAlbums}`);
    console.log(`   Albums deleted: ${deleteResult.bulkResults.albumsDeleted}`);
    console.log(`   Total images: ${deleteResult.bulkResults.totalImages}`);
    console.log(`   Images deleted from DB: ${deleteResult.bulkResults.imagesDeletedFromDB}`);
    console.log(`   Images deleted from Cloudinary: ${deleteResult.bulkResults.imagesDeletedFromCloudinary}`);

    if (deleteResult.bulkResults.errors.length > 0) {
      console.log('\n⚠️  Album Deletion Errors:');
      deleteResult.bulkResults.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. Album ID: ${error.albumId}`);
        console.log(`      Error: ${error.error}`);
      });
    }

    if (deleteResult.bulkResults.cloudinaryErrors.length > 0) {
      console.log('\n⚠️  Cloudinary Errors:');
      deleteResult.bulkResults.cloudinaryErrors.forEach((error, index) => {
        console.log(`   ${index + 1}. Public ID: ${error.publicId}`);
        console.log(`      Error: ${error.error}`);
      });
    }

    // 6. Verify bulk deletion
    console.log('\n🔍 Verifying bulk deletion...');
    const verifyResponse = await fetch(`${BASE_URL}/album`);
    const verifyData = await verifyResponse.json();
    
    const remainingAlbums = verifyData.data.filter(album => 
      albumIds.includes(album._id)
    );
    
    if (remainingAlbums.length > 0) {
      console.log(`❌ ${remainingAlbums.length} albums still exist in database!`);
    } else {
      console.log('✅ All albums successfully removed from database');
    }

    console.log(`📊 Albums remaining: ${verifyData.data.length}`);

  } catch (error) {
    console.error('💥 Bulk deletion test failed:', error.message);
  }
}

async function runAllTests() {
  console.log('🧪 Starting Album Deletion Tests\n');
  console.log('='.repeat(50));
  
  await testSingleAlbumDeletion();
  
  console.log('\n' + '='.repeat(50));
  
  await testBulkAlbumDeletion();
  
  console.log('\n' + '='.repeat(50));
  console.log('🎉 All tests completed!');
}

// Run all tests
runAllTests();