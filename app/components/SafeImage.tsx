import { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface SafeImageProps extends Omit<ImageProps, 'onError'> {
  fallbackSrc?: string;
}

export const SafeImage = ({ 
  src, 
  alt, 
  fallbackSrc = '/placeholder.jpeg',
  ...props 
}: SafeImageProps) => {
  const [error, setError] = useState(false);

  return (
    <Image
      {...props}
      src={error ? fallbackSrc : src}
      alt={alt}
      onError={() => setError(true)}
    />
  );
};

export default SafeImage; 