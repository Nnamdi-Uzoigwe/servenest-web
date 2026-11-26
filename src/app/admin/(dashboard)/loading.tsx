export default function Loading() {
  return (
    <div className="space-y-8 motion-safe:animate-pulse" aria-busy="true" aria-label="Loading">
      <div className="h-10 w-72 rounded-control bg-field" />
      <div className="h-24 rounded-panel bg-field" />
      <div className="h-80 rounded-panel bg-field" />
    </div>
  );
}