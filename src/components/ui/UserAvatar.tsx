import Image from "next/image";
import { cloudinaryThumb } from "@/lib/cloudinary";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

interface UserAvatarProps {
  name: string;
  url?: string;
  size?: number;
}

export function UserAvatar({ name, url, size = 40 }: UserAvatarProps) {
  return (
    <span
      className="inline-grid shrink-0 place-items-center overflow-hidden rounded-full bg-ink font-semibold text-champagne"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}
    >
      {url ? (
        <Image
          src={cloudinaryThumb(url, size * 2)}
          alt=""
          width={size}
          height={size}
          unoptimized
          className="size-full object-cover"
        />
      ) : (
        initials(name)
      )}
    </span>
  );
}