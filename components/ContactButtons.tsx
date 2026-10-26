import { Phone } from "lucide-react";
import { TEL, WHATSAPP } from "@/lib/site";

// lucide has no brand icons, so the WhatsApp mark is inlined.
export function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35zM12.05 21.5h-.01a9.4 9.4 0 0 1-4.79-1.31l-.34-.2-3.56.93.95-3.47-.22-.36a9.38 9.38 0 0 1-1.44-5c0-5.19 4.23-9.42 9.43-9.42 2.52 0 4.88.98 6.66 2.76a9.36 9.36 0 0 1 2.76 6.67c0 5.2-4.23 9.42-9.43 9.42zm8.02-17.44A11.27 11.27 0 0 0 12.05.75C5.8.75.71 5.84.7 12.1c0 2 .52 3.95 1.52 5.67L.6 23.25l5.6-1.47a11.3 11.3 0 0 0 5.84 1.6h.01c6.25 0 11.34-5.1 11.35-11.36 0-3.03-1.18-5.88-3.33-8.02z" />
    </svg>
  );
}

export function CallButton({ label = "Call Now", className = "" }: { label?: string; className?: string }) {
  return (
    <a href={TEL} className={`btn btn--gold ${className}`}>
      <Phone size={18} aria-hidden="true" />
      {label}
    </a>
  );
}

export function WhatsAppButton({ label = "WhatsApp", className = "" }: { label?: string; className?: string }) {
  return (
    <a href={WHATSAPP} target="_blank" rel="noreferrer" className={`btn btn--whatsapp ${className}`}>
      <WhatsAppIcon size={19} />
      {label}
    </a>
  );
}
