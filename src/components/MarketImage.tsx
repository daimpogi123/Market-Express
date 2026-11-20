import { useState } from 'react';
import { Sprout } from 'lucide-react';

interface MarketImageProps {
  src: string;
  alt: string;
  className?: string;
  objectPosition?: string;
  imageScale?: number;
  grayscale?: boolean;
}

export function MarketImage({
  src,
  alt,
  className = '',
  objectPosition = 'center',
  imageScale = 1,
  grayscale = false,
}: MarketImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#EEF2EA] text-[#3F5242] p-4 text-center ${
          grayscale ? 'grayscale opacity-75' : ''
        } ${className}`}
        role="img"
        aria-label={alt}
      >
        <Sprout className="w-8 h-8 mb-2 text-[#166534]/60" aria-hidden="true" />
        <span className="text-xs font-medium text-[#4A584C] line-clamp-2">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => setHasError(true)}
      style={{
        objectPosition,
        transformOrigin: objectPosition,
        transform: imageScale > 1 ? `scale(${imageScale})` : undefined,
      }}
      className={`object-cover transition-transform duration-200 ${
        grayscale ? 'grayscale opacity-70' : ''
      } ${className}`}
    />
  );
}
