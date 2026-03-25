const cloudinary = require('cloudinary').v2;

// This pulls your hidden keys from Vercel's vault
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 1. Get the JSON data sent from your HTML file
    const productsData = JSON.stringify(req.body);
    
    // 2. Upload it securely to Cloudinary using your secret keys
    const result = await cloudinary.uploader.upload(
      `data:application/json;base64,${Buffer.from(productsData).toString('base64')}`, 
      {
        resource_type: 'raw',
        public_id: 'yk-products.json',
        folder: 'yk-products',
        overwrite: true,
        invalidate: true
      }
    );

    // 3. Tell the frontend it worked!
    res.status(200).json({ success: true, url: result.secure_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save to Cloudinary' });
  }
}
