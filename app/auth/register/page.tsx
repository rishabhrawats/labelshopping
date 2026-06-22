import Link from "next/link";
import { redirect } from "next/navigation";
import { registerUser } from "@/actions/authActions";

export default function RegisterPage({ searchParams }: { searchParams?: { error?: string } }) {
  const error = searchParams?.error ? decodeURIComponent(searchParams.error) : "";

  return (
    <div className="container-page py-14">
      <div className="mx-auto max-w-md rounded-2xl border border-[#eadfcc] bg-white p-6 shadow-card">
        <h1 className="font-display text-3xl text-maroon">Create Account</h1>
        <form
          className="mt-5 space-y-3"
          action={async (formData) => {
            "use server";
            try {
              await registerUser(formData);
              redirect("/auth/signin");
            } catch (err) {
              const message = (err as Error).message || "Unable to create account";
              redirect(`/auth/register?error=${encodeURIComponent(message)}`);
            }
          }}
        >
          <input required type="text" name="name" placeholder="Full name" className="w-full rounded-xl border p-3 text-sm" />
          <input required type="email" name="email" placeholder="Email" className="w-full rounded-xl border p-3 text-sm" />
          <input required minLength={8} type="password" name="password" placeholder="Password" className="w-full rounded-xl border p-3 text-sm" />
          <button className="w-full rounded-xl bg-maroon px-4 py-3 text-sm font-semibold text-white">Create account</button>
        </form>
        {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
        <p className="mt-4 text-sm text-stone-600">Already registered? <Link href="/auth/signin" className="text-maroon">Sign in</Link></p>
      </div>
    </div>
  );
}
