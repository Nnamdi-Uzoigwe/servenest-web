// Only allow redirects to pages inside the dashboard, never to another site
export function safeNext(value: string | null | undefined): string {
  if (value && /^\/admin(\/|\?|$)/.test(value)) return value;
  return "/admin";
}