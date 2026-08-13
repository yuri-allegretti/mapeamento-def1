import Image from "next/image";

export function BrandLogo({ priority = false, className = "h-11 w-auto" }: { priority?: boolean; className?: string }) {
  return (
    <Image
      src="/brand/aroeira-logo.jpeg"
      alt="Aroeira Office Park"
      width={1280}
      height={369}
      priority={priority}
      className={className}
      sizes="(max-width: 1024px) 150px, 190px"
    />
  );
}
