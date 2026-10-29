import { LIFE_SERVICES, LOVE_SERVICES } from "@/lib/site";

export type ManagedService = {
  id: string;
  title: string;
  text: string;
  img: string;
  group: "love" | "life";
  visible: boolean;
};
export type ServiceContent = {
  services: ManagedService[];
  updatedAt: string | null;
};
export const DEFAULT_CONTENT: ServiceContent = {
  updatedAt: null,
  services: [
    ...LOVE_SERVICES.map((s, i) => ({ ...s, id: `love-${i + 1}`, group: "love" as const, visible: true })),
    ...LIFE_SERVICES.map((s, i) => ({ ...s, id: `life-${i + 1}`, group: "life" as const, visible: true })),
  ],
};

export function validateContent(value: unknown): ServiceContent {
  if (!value || typeof value !== "object" || !("services" in value) || !Array.isArray(value.services)) {
    throw new Error("Invalid services content.");
  }
  if (value.services.length > 60) throw new Error("A maximum of 60 services is supported.");
  const ids = new Set<string>();
  const services = value.services.map((s: unknown) => {
    if (!s || typeof s !== "object") throw new Error("Invalid service.");
    const item = s as Record<string, unknown>;
    if (typeof item.id !== "string" || !/^[a-zA-Z0-9-]{1,80}$/.test(item.id) || ids.has(item.id)) {
      throw new Error("Each service must have a unique ID.");
    }
    ids.add(item.id);
    if (typeof item.title !== "string" || !item.title.trim() || item.title.trim().length > 100) {
      throw new Error("Service titles must contain 1–100 characters.");
    }
    if (typeof item.text !== "string" || !item.text.trim() || item.text.trim().length > 2000) {
      throw new Error("Service descriptions must contain 1–2,000 characters.");
    }
    if (typeof item.img !== "string" || item.img.length > 2048) throw new Error("Invalid image path.");
    const localImage = /^\/assets\/img\/[a-zA-Z0-9_\-/]+\.(webp|png|jpe?g)$/i.test(item.img);
    const uploadedImage = /^\/api\/media\/[a-f0-9-]{36}\.webp$/.test(item.img);
    let remoteImage = false;
    try {
      const url = new URL(item.img);
      remoteImage = url.protocol === "https:" && !url.username && !url.password;
    } catch { /* Local paths are checked separately. */ }
    if (!localImage && !uploadedImage && !remoteImage) throw new Error("Choose an image, a local image path, or an HTTPS image URL.");
    if (item.group !== "love" && item.group !== "life") throw new Error("Choose a valid service group.");
    if (typeof item.visible !== "boolean") throw new Error("Invalid service visibility.");
    return { id: item.id, title: item.title.trim(), text: item.text.trim(), img: item.img,
      group: item.group, visible: item.visible } satisfies ManagedService;
  });
  const updatedAt = "updatedAt" in value ? value.updatedAt : null;
  if (updatedAt !== null && (typeof updatedAt !== "string" || !Number.isFinite(Date.parse(updatedAt)))) {
    throw new Error("Invalid saved revision.");
  }
  return { services, updatedAt };
}
