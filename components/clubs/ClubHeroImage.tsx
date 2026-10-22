import Image from 'next/image';

type ClubHeroImageProps = {
  alt: string;
  className: string;
  loading?: 'eager' | 'lazy';
  src: string;
};

/**
 * Keeps the complete upload visible on a guaranteed white canvas. The white
 * backing is intentional: transparent logos and assets without their own
 * background must never inherit color from the surrounding card or banner.
 */
export default function ClubHeroImage({
  alt,
  className,
  loading = 'lazy',
  src
}: ClubHeroImageProps) {
  return (
    <div className={`relative overflow-hidden bg-white ${className}`}>
      <Image
        alt={alt}
        className="relative h-full w-full object-contain p-3 transition-transform duration-300 group-hover:scale-[1.02] sm:p-5"
        fill
        loading={loading}
        sizes="100vw"
        src={src}
        unoptimized
      />
    </div>
  );
}

