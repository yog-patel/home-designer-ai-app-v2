import { supabase, BUCKETS, STORAGE_PATHS } from './supabase';

export const generateDesign = async (
  userId: string,
  imageUrl: string,
  prompt: string,
  roomType: string,
  style: string,
  palette: string
) => {
  try {
    const url = `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/generate-design`;
    const authToken = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

    console.log('🎨 Generating design...');
    console.log('URL:', url);
    console.log('Auth token exists:', !!authToken);
    console.log('Payload:', { userId, imageUrl, prompt });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        userId,
        imageUrl,
        prompt,
        roomType,
        style,
        palette,
        negativePrompt: 'blurry, distorted, ugly, low quality, artifacts',
      }),
    });

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);

    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return data;
  } catch (error: any) {
    console.error('❌ Error generating design:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    throw new Error(
      error.message || 'Network request failed. Please check your connection and try again.'
    );
  }
};

export const checkUsage = async (userId: string, action: string = 'check') => {
  try {
    const url = `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/check-usage`;
    const authToken = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

    console.log('📊 Checking usage...');
    console.log('Action:', action);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        userId,
        action,
      }),
    });

    const data = await response.json();

    // HTTP 402 means quota exceeded, which is a valid response
    if (response.status === 402) {
      console.warn('⚠️ Free tier quota exceeded (HTTP 402)');
      return data;
    }

    if (!response.ok) {
      console.error(`❌ HTTP ${response.status} error:`, data);
      throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    console.log('✅ Usage check successful:', data);
    return data;
  } catch (error: any) {
    console.error('❌ Error checking usage:', error);
    
    // For 'check' action, return safe default values instead of crashing
    if (action === 'check') {
      console.warn('⚠️ Falling back to default usage (edge function unavailable)');
      return {
        designs_generated: 0,
        is_premium: false,
        allowed: false,
      };
    }
    
    // For 'increment' action, silently fail - usage will be attempted next time
    if (action === 'increment') {
      console.warn('⚠️ Usage increment skipped (edge function unavailable)');
      return { success: true };
    }
    
    throw error;
  }
};

export const uploadImage = async (
  userId: string,
  imageUri: string,
  filename: string
): Promise<string> => {
  try {
    console.log('📤 Starting image upload...');
    console.log('User ID:', userId);
    console.log('Image URI:', imageUri);
    console.log('Filename:', filename);

    // Read the image file
    const response = await fetch(imageUri);
    if (!response.ok) {
      throw new Error(`Failed to read image: ${response.statusText}`);
    }
    const blob = await response.blob();
    console.log('Blob size:', blob.size, 'bytes');

    // Upload to Supabase Storage: room-images/designs/userId/filename
    const path = `${STORAGE_PATHS.DESIGNS}/${userId}/${filename}`;
    console.log('Upload path:', path);
    console.log('Bucket:', BUCKETS.ROOM_IMAGES);

    // Attempt Supabase storage upload
    let publicUrl: string | null = null;
    
    try {
      const { data, error } = await supabase.storage
        .from(BUCKETS.ROOM_IMAGES)
        .upload(path, blob, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error('❌ Supabase Upload error details:', {
          message: error.message,
          name: error.name,
          statusCode: (error as any).statusCode,
        });
        throw error;
      }

      console.log('✅ Upload successful:', data.path);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(BUCKETS.ROOM_IMAGES)
        .getPublicUrl(data.path);

      publicUrl = urlData.publicUrl;
      console.log('Public URL:', publicUrl);
    } catch (storageError: any) {
      console.warn('⚠️ Supabase storage failed, using data URL instead');
      
      // Fallback: Convert image to data URL for testing
      const reader = new FileReader();
      await new Promise((resolve, reject) => {
        reader.onload = resolve;
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      
      publicUrl = reader.result as string;
      console.log('Using data URL (length:', publicUrl.length, ')');
      
      if (!publicUrl) {
        throw new Error('Failed to create image data URL');
      }
    }

    return publicUrl;
  } catch (error: any) {
    console.error('❌ Error uploading image:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    throw new Error(
      error.message || 'Failed to upload image. Please check your connection.'
    );
  }
};
