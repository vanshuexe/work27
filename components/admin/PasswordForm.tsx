"use client";
import Link from "next/link";
import { useActionState } from "react";
import { changePassword } from "@/app/admin/actions";

export default function PasswordForm() {
  const [state, action, pending] = useActionState(changePassword, {});
  return <form action={action} className="admin-form">
    <label htmlFor="new-password">New password</label>
    <input id="new-password" name="password" type="password" autoComplete="new-password" minLength={12} maxLength={200} required aria-describedby="password-help" />
    <small id="password-help">Use at least 12 characters.</small>
    <label htmlFor="confirm-password">Confirm new password</label>
    <input id="confirm-password" name="confirm" type="password" autoComplete="new-password" minLength={12} maxLength={200} required />
    {state.error && <p role="alert" className="admin-field-error">{state.error}</p>}
    {state.success && <p role="status" className="admin-notice success">{state.success}</p>}
    <button className="admin-button primary full" disabled={pending}>{pending ? "Saving password…" : "Save password"}</button>
    <Link href="/admin" className="admin-button secondary full">Open dashboard</Link>
  </form>;
}
