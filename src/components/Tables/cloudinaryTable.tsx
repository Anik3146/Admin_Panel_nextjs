import { useState } from 'react';
import { useAuth } from '@/app/context/useAuth';
import { baseUrl } from '@/utils/constant';

const CloudinaryTable = () => {
  const { user } = useAuth();

  // State to store the selected file
  const [imageFile, setImageFile] = useState<File | null>(null);

  // State to store the uploaded image URL from Cloudinary
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  // State to track upload status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      setImageFile(file);
    }
  };

  // Handle image upload to Cloudinary using fetch
  const handleImageUpload = async () => {
    if (!imageFile) {
      setError('No file selected');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      // Replace '/add-img' with your actual backend upload URL
      const response = await fetch(`${baseUrl}/api/cloudinary/add-img`, {
        method: 'POST',
        body: formData, // FormData automatically handles multipart/form-data content type
      });

      // Check if the response is OK (status 200-299)
      if (!response.ok) {
        throw new Error('Image upload failed');
      }

      const data = await response.json();

      // Assuming the response contains a field `imageUrl` with the uploaded image URL
      setUploadedImageUrl(data.imageUrl);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError('Upload failed. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      <h2>Upload Image to Cloudinary</h2>

      {/* File input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="rounded-md border border-gray-300 p-2"
      />

      {/* Upload button */}
      <button
        onClick={handleImageUpload}
        disabled={loading || !imageFile}
        className="mx-2 mt-3 rounded-md bg-blue-500 p-2 text-white"
      >
        {loading ? 'Uploading...' : 'Upload Image'}
      </button>

      {/* Display error message */}
      {error && <p className="mt-2 text-red-500">{error}</p>}

      {/* Display uploaded image */}
      {uploadedImageUrl && (
        <div className="mt-4">
          <p>Uploaded Image:</p>
          <img
            src={uploadedImageUrl}
            alt="Uploaded"
            className="mt-2 max-w-xs"
          />
        </div>
      )}
    </div>
  );
};

export default CloudinaryTable;
