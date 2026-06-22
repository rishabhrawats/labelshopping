"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { withBasePath } from "@/lib/site";

const hasGoogleAuth = process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true";
const hasMagicLinkAuth = process.env.NEXT_PUBLIC_MAGIC_LINK_ENABLED === "true";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCredentials = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn("credentials", {
      email,
      password,
      callbackUrl: withBasePath("/account"),
      redirect: false
    });
    if (result?.error) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }
    window.location.href = withBasePath("/account");
    setLoading(false);
  };

  return (
    <div className="container-page py-14">
      <div className="mx-auto max-w-md rounded-2xl border border-[#eadfcc] bg-white p-6 shadow-card">
        <h1 className="font-display text-3xl text-maroon">Sign In</h1>
        <form onSubmit={handleCredentials} className="mt-5 space-y-3">
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full rounded-xl border p-3 text-sm" />
          <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full rounded-xl border p-3 text-sm" />
          <button disabled={loading} className="w-full rounded-xl bg-maroon px-4 py-3 text-sm font-semibold text-white">{loading ? "Signing in..." : "Sign in"}</button>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
        </form>
        {hasGoogleAuth || hasMagicLinkAuth ? (
          <div className="mt-4 space-y-2">
            {hasGoogleAuth ? (
              <button
                onClick={() => signIn("google", { callbackUrl: withBasePath("/account") })}
                className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm font-medium"
              >
                Continue with Google
              </button>
            ) : null}
            {hasMagicLinkAuth ? (
              <button
                onClick={() => signIn("email", { email, callbackUrl: withBasePath("/account") })}
                className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm font-medium"
              >
                Send Magic Link
              </button>
            ) : null}
          </div>
        ) : null}
        <p className="mt-4 text-sm text-stone-600">New customer? <Link href="/auth/register" className="text-maroon">Create an account</Link></p>
      </div>
    </div>
  );
}
