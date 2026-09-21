import React, { useState } from 'react';

interface SmoothImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  aspectRatio?: string;
  skeletonClassName?: string;
  onLoaded?: () => void;
}

export const SmoothImage: React.FC<SmoothImageProps> = ({
  src,
  alt = 'Photography Asset',
  className = '',
  style = {},
  aspectRatio,
  skeletonClassName = '',
  onLoaded,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: 'var(--surface-dark, #18181b)',
        ...(aspectRatio ? { aspectRatio } : {}),
      }}
      className="smooth-image-wrapper"
    >
      {/* Subtle Shimmer Skeleton while image is loading */}
      {!isLoaded && !hasError && (
        <div
          className={`smooth-image-skeleton ${skeletonClassName}`}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(229,169,30,0.08) 50%, rgba(255,255,255,0.03) 100%)',
            backgroundSize: '200% 100%',
            animation: 'smoothShimmer 1.8s infinite ease-in-out',
          }}
        />
      )}

      {/* Image with progressive fade-in */}
      {!hasError ? (
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          loading="lazy"
          onLoad={() => {
            setIsLoaded(true);
            onLoaded?.();
          }}
          onError={() => {
            setHasError(true);
          }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 500ms cubic-bezier(0.16, 1, 0.3, 1)',
            ...style,
          }}
          className={`smooth-img ${className}`}
          {...props}
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--surface-subtle, #f4f4f5)',
            color: 'var(--text-muted, #71717a)',
            fontSize: '0.75rem',
          }}
        >
          <span>Image unavailable</span>
        </div>
      )}

      <style>{`
        @keyframes smoothShimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  );
};
