"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LandingHeaderAuth } from "./AuthCtas";
import { SyncStatus } from "./SyncStatus";

const NAV = [
  { href: "/dashboard", label: "Home" },
  { href: "/horizon", label: "To buy" },
  { href: "/vault", label: "Owned" },
  { href: "/growth", label: "Growth" },
  { href: "/capture", label: "Add" },
  { href: "/settings", label: "Settings" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  const isAuth =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");
  const isLanding = pathname === "/";

  if (isAuth) {
    return <>{children}</>;
  }

  if (isLanding) {
    return (
      <div className="flex min-h-full flex-col">
        <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 md:px-8">
            <Link
              href="/"
              className="text-lg font-semibold tracking-tight text-deep-fir md:text-xl"
            >
              Desire Ledger
            </Link>
            <div className="flex shrink-0 items-center gap-2">
              <LandingHeaderAuth />
              {isSignedIn ? (
                <UserButton
                  appearance={{
                    elements: { avatarBox: "h-8 w-8" },
                  }}
                />
              ) : null}
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-8 md:px-8 md:py-12">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-40 bg-deep-fir text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 md:px-8">
          <Link
            href="/dashboard"
            className="text-lg font-semibold tracking-tight md:text-xl"
          >
            Desire Ledger
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden text-xs font-medium text-white/65 hover:text-white sm:inline"
            >
              Landing
            </Link>
            <SyncStatus />
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8",
                },
              }}
            />
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-5 pb-3.5 md:px-8">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-sulu text-on-sulu"
                    : "text-white/75 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-8 md:px-8 md:py-12">
        {children}
      </main>
    </div>
  );
}
