export const personalize = (template: string, name: string) =>
  template.replace(/\{name\}/g, name || "you");

export const titleCase = (s: string) => {
  if (!s || !s.trim()) return "";
  return s
    .trim()
    .split(/\s+/)
    .map((w) => (w[0] ? w[0].toUpperCase() + w.slice(1).toLowerCase() : ""))
    .join(" ")
    .slice(0, 20);
};
