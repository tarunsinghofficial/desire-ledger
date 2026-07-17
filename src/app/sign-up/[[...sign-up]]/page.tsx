"use client";

import { ClerkLoaded, ClerkLoading, SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link
            href="/"
            className="text-sm font-medium text-deep-fir/70 hover:text-deep-fir"
          >
            Desire Ledger
          </Link>
          <h1 className="mt-2 text-3xl font-semibold text-deep-fir">
            Create your ledger
          </h1>
          <p className="mt-2 text-deep-fir/70">
            Track what you want, when to buy it, and how it helps you.
          </p>
        </div>

        <ClerkLoading>
          <div className="rounded-[1.25rem] bg-mist px-4 py-8 text-center">
            <p className="text-sm text-fir-muted">Opening create account…</p>
            <Link href="/sign-in" className="btn btn-primary mt-5 inline-flex">
              Sign in instead
            </Link>
          </div>
        </ClerkLoading>

        <ClerkLoaded>
          <div className="flex justify-center [&_.cl-rootBox]:w-full [&_.cl-card]:w-full [&_.cl-card]:max-w-none">
            <SignUp
              routing="path"
              path="/sign-up"
              forceRedirectUrl="/dashboard"
              signInUrl="/sign-in"
            />
          </div>
        </ClerkLoaded>
      </div>
    </div>
  );
}
