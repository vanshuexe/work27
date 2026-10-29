"use client";
import { useActionState, useState } from "react";
import { ArrowRight, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { signIn } from "@/app/admin/actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState(signIn, {});
  const [show, setShow] = useState(false);
  return <form action={action} className="admin-form">
    <label htmlFor="email">Email address</label>
    <input id="email" name="email" type="email" autoComplete="username" placeholder="you@example.com" required maxLength={254} />
    <label htmlFor="password">Password</label>
    <div className="admin-password-input">
      <input id="password" name="password" type={show ? "text" : "password"} autoComplete="current-password" required maxLength={200} />
      <button type="button" className="admin-icon-button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"}>{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>
    </div>
    {state.error && <p className="admin-field-error" role="alert">{state.error}</p>}
    <button className="admin-button primary full" disabled={pending}>{pending ? <><LoaderCircle className="admin-spin" size={18} /> Signing in…</> : <>Sign in <ArrowRight size={18} /></>}</button>
    <p className="admin-form-help">First time here? Open your private setup link to choose a password. To reset access, request a new link from the website owner.</p>
  </form>;
}
