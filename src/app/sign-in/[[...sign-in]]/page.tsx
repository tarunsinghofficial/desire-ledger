"use client";

import { ClerkLoaded, ClerkLoading, SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function SignInPage() {
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
            Welcome back
          </h1>
          <p className="mt-2 text-deep-fir/70">
            Sign in to open your dashboard and bucket list.
          </p>
        </div>

        <ClerkLoading>
          <div className="rounded-[1.25rem] bg-mist px-4 py-8 text-center">
            <p className="text-sm text-fir-muted">Opening sign in…</p>
            <Link href="/sign-up" className="btn btn-primary mt-5 inline-flex">
              Create account instead
            </Link>
          </div>
        </ClerkLoading>

        <ClerkLoaded>
          <div className="flex justify-center [&_.cl-rootBox]:w-full [&_.cl-card]:w-full [&_.cl-card]:max-w-none">
            <SignIn
              routing="path"
              path="/sign-in"
              forceRedirectUrl="/dashboard"
              signUpUrl="/sign-up"
            />
          </div>
        </ClerkLoaded>
      </div>
    </div>
  );
}
