import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ImagePreviewProps {
  image: { url: string; name: string };
  size?: 'sm' | 'md' | 'lg';
}

export function ImagePreview({ image, size = 'md' }: ImagePreviewProps) {
  const [isOpen, setIsOpen] = useState(false);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="group relative rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
          <img
            src={image.url}
            alt={image.name}
            className={`${sizeClasses[size]} object-cover rounded-lg transition-transform group-hover:scale-105`}
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white text-sm">View</span>
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-fit">
        <img
          src={image.url}
          alt={image.name}
          className="max-h-[80vh] w-auto object-contain"
        />
      </DialogContent>
    </Dialog>
  );
} 