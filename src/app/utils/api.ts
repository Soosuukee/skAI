export function getApiBaseUrl(): string {
  // Prefer explicit NEXT_PUBLIC_API_BASE_URL; fallback to README default
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8080/api/v1"
  );
}


