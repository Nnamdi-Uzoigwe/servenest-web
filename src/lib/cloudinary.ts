const isCloudinary = (url: string) =>
  url.includes("res.cloudinary.com") && url.includes("/upload/");

// A square, resized and compressed version of a Cloudinary image, for avatars
export function cloudinaryThumb(url: string, size: number): string {
  if (!isCloudinary(url)) return url;
  return url.replace("/upload/", `/upload/c_fill,g_auto,w_${size},h_${size},f_auto,q_auto/`);
}

// Keeps the aspect ratio and caps the width, for looking at a document
export function cloudinaryFit(url: string, width: number): string {
  if (!isCloudinary(url)) return url;
  return url.replace("/upload/", `/upload/c_limit,w_${width},f_auto,q_auto/`);
}