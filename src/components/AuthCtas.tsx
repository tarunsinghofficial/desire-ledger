"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";

/** Always show auth actions — never wait on Clerk loading (LAN/mobile often stalls). */
export function LandingAuthCtas() {
  const { isLoaded, isSignedIn } = useAuth();
  const signedIn = Boolean(isLoaded && isSignedIn);

  if (signedIn) {
    return (
      <>
        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard" className="btn btn-primary">
            Go to dashboard
          </Link>
          <Link
            href="/capture"
            className="btn rounded-full border border-white/25 bg-transparent text-white hover:bg-white/10"
          >
            Add an item
          </Link>
        </div>
        <p className="text-sm text-white/55">
          Welcome back — pick up where you left off.
        </p>
      </>
    );
  }

  return (
    <>
      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
        <Link href="/sign-in" className="btn btn-primary w-full sm:w-auto">
          Sign in
        </Link>
        <Link
          href="/sign-up"
          className="btn w-full rounded-full border border-white/25 bg-transparent text-white hover:bg-white/10 sm:w-auto"
        >
          Create account
        </Link>
      </div>
      <p className="text-sm text-white/55">
        Free to start. Your list stays with your account.
      </p>
    </>
  );
}

export function LandingHeaderAuth() {
  const { isLoaded, isSignedIn } = useAuth();
  const signedIn = Boolean(isLoaded && isSignedIn);

  if (signedIn) {
    return (
      <Link href="/dashboard" className="btn btn-primary !py-2 text-sm">
        Dashboard
      </Link>
    );
  }

  return (
    <>
      <Link
        href="/sign-in"
        className="btn btn-ghost !px-3 !py-2 text-sm"
      >
        Sign in
      </Link>
      <Link
        href="/sign-up"
        className="btn btn-primary !px-3 !py-2 text-sm"
      >
        Get started
      </Link>
    </>
  );
}
