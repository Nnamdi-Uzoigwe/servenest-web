// The public address of the site, used for link previews
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Optional. Leave it empty and the "Follow the build" links are hidden.
const rawX = process.env.NEXT_PUBLIC_X_URL;
export const X_URL = rawX && rawX.startsWith("https://") ? rawX : undefined;