// A square, resized and compressed version of a Cloudinary image URL
export function cloudinaryThumb(url: string, size: number): string {
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;
  return url.replace("/upload/", `/upload/c_fill,g_auto,w_${size},h_${size},f_auto,q_auto/`);
}