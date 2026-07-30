"use client";

import Image, { ImageProps } from "next/image";
import { useState, useEffect } from "react";

interface SafeImageProps extends Omit<ImageProps, "src" | "onError"> {
  src: string;
  fallbackSrc?: string;
}

export default function SafeImage({ src, fallbackSrc = "/img/default-avatar.png", alt, ...props }: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  // If the src prop changes externally, reset the internal state
  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <Image
      src={imgSrc || fallbackSrc}
      alt={alt || ""}
      onError={() => setImgSrc(fallbackSrc)}
      {...props}
    />
  );
}
