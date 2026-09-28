export function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}
export function csvTags(value: string) {
  return value.split(",").map(v => v.trim()).filter(Boolean);
}
export function formatAdminDate(value?: string) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", {day:"2-digit",month:"short",year:"numeric"});
}
