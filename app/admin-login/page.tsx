"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      callbackUrl: "/admin/products",
      redirect: false
    });

    if (result?.error) {
      setError("Invalid admin email or password.");
      setLoading(false);
      return;
    }

    window.location.href = "/admin/products";
  };

  return (
    <main className="container-page flex min-h-[70vh] items-center justify-center py-14">
      <section className="w-full max-w-md rounded-3xl border border-border bg-white p-7 shadow-luxe">
        <p className="text-xs uppercase tracking-[0.18em] text-muted">Label Saumya</p>
        <h1 className="mt-2 font-display text-3xl text-maroon">Admin Login</h1>
        <p className="mt-2 text-sm text-muted">Manage products, upload galleries, prices, and stock.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Admin email</label>
            <input
              required
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-border p-3 text-sm"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Password</label>
            <input
              required
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-border p-3 text-sm"
            />
          </div>
          <button
            disabled={loading}
            className="w-full rounded-xl bg-maroon px-4 py-3 text-sm font-semibold text-white hover:bg-deep-maroon disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Open Admin Panel"}
          </button>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
        </form>
      </section>
    </main>
  );
}
