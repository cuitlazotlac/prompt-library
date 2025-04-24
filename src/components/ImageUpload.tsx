import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { uploadFile, deleteFile } from '@/lib/storage';
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { ImagePreview } from './ImagePreview';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';

interface ImageUploadProps {
  images: { url: string; name: string }[];
  onChange: (images: { url: string; name: string }[]) => void;
  maxImages?: number;
}

export function ImageUpload({ images, onChange, maxImages = 3 }: ImageUploadProps) {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [totalProgress, setTotalProgress] = useState(0);

  const handleFileSelect = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'image/jpeg,image/png,image/webp';
    input.onchange = (e) => handleFileChange(e as any);
    input.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !user) return;

    // Check total number of images
    if (images.length + files.length > maxImages) {
      toast.error(`You can only upload up to ${maxImages} images`);
      return;
    }

    setIsUploading(true);
    setTotalProgress(0);
    setUploadProgress({});

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const fileId = `${Date.now()}_${file.name}`;
        setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

        try {
          const result = await uploadFile(
            file,
            {
              onProgress: (progress) => {
                setUploadProgress(prev => {
                  const newProgress = { ...prev, [fileId]: progress };
                  // Calculate total progress across all files
                  const total = Object.values(newProgress).reduce((a, b) => a + b, 0) / files.length;
                  setTotalProgress(total);
                  return newProgress;
                });
              },
              onError: (error) => {
                toast.error(`Failed to upload ${file.name}: ${error.message}`);
                // Remove the progress entry for failed upload
                setUploadProgress(prev => {
                  const newProgress = { ...prev };
                  delete newProgress[fileId];
                  return newProgress;
                });
              },
              onComplete: () => {
                toast.success(`${file.name} uploaded successfully`);
              }
            }
          );
          return result;
        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error);
          return null;
        }
      });

      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter((result): result is { url: string; name: string } => result !== null);
      
      if (successfulUploads.length > 0) {
        onChange([...images, ...successfulUploads]);
        if (successfulUploads.length === files.length) {
          toast.success('All images uploaded successfully');
        } else {
          toast.success(`${successfulUploads.length} out of ${files.length} images uploaded successfully`);
        }
      }
    } catch (error) {
      toast.error('Failed to upload images');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress({});
      setTotalProgress(0);
    }
  };

  const handleRemoveImage = async (index: number) => {
    try {
      const image = images[index];
      const newImages = [...images];
      newImages.splice(index, 1);
      onChange(newImages);
      
      // Attempt to delete from storage
      try {
        await deleteFile(image.url);
      } catch (error) {
        console.error('Failed to delete file from storage:', error);
      }
    } catch (error) {
      toast.error('Failed to remove image');
      console.error('Remove image error:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {images.map((image, index) => (
          <div key={image.url} className="relative group">
            <ImagePreview image={image} />
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remove image"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        ))}

        {images.length < maxImages && (
          <Button
            type="button"
            variant="outline"
            className="w-24 h-24 flex flex-col items-center justify-center gap-2 border-dashed"
            onClick={handleFileSelect}
            disabled={isUploading}
          >
            <PhotoIcon className="w-6 h-6" />
            <span className="text-xs">Add Image</span>
          </Button>
        )}
      </div>

      {isUploading && (
        <div className="space-y-2">
          <Progress value={totalProgress} />
          <p className="text-sm text-muted-foreground">
            Uploading... {Math.round(totalProgress)}%
          </p>
          {Object.entries(uploadProgress).map(([fileId, progress]) => (
            <div key={fileId} className="text-xs text-muted-foreground">
              {fileId.split('_')[1]}: {Math.round(progress)}%
            </div>
          ))}
        </div>
      )}

      <p className="text-sm text-muted-foreground">
        Supported formats: JPEG, PNG, WEBP. Max {maxImages} images. Each file must be under 5MB.
      </p>
    </div>
  );
} 