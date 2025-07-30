 
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000/api/v1/admin'; // Adjust port as needed

async function testAlbumDeletion() {
  try {
    console.log('🧪 Testing Album Deletion Functionality\n');


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


    albumsData.data.forEach((album, index) => {
      console.log(`\n📁 Album ${index + 1}:`);
      console.log(`   ID: ${album._id}`);
      console.log(`   Title: ${album.title}`);
      console.log(`   Images: ${album.images.length}`);
    });


    const albumToDelete = albumsData.data[0]; 
    if (!albumToDelete) {
      console.log('⚠️  No album selected for deletion');
      return;
    }

    console.log(`\n🗑️  Attempting to delete album: "${albumToDelete.title}" (${albumToDelete._id})`);
    console.log(`   This album has ${albumToDelete.images.length} images`);

    const deleteResponse = await fetch(`${BASE_URL}/delete/albums/${albumToDelete._id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const deleteResult = await deleteResponse.json();

    if (deleteResult.error) {
      console.error('❌ Deletion failed:', deleteResult.message);
      return;
    }

    console.log('\n✅ Album deletion completed!');
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
    console.error('💥 Test failed with error:', error.message);
  }
}


testAlbumDeletion();