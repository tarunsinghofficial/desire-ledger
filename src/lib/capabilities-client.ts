"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { SELF_HOST_HINT } from "@/lib/demo-access";

export type Capabilities = {
  cloudSync: boolean;
  ai: boolean;
  isOwner: boolean;
  selfHostHint: string;
};

const FALLBACK: Capabilities = {
  cloudSync: false,
  ai: false,
  isOwner: false,
  selfHostHint: SELF_HOST_HINT,
};

export function useCapabilities(): {
  caps: Capabilities;
  loaded: boolean;
} {
  const { userId, isLoaded: authLoaded } = useAuth();
  const [caps, setCaps] = useState<Capabilities>(FALLBACK);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!authLoaded) return;
    let cancelled = false;
    setLoaded(false);
    void fetch("/api/capabilities")
      .then((res) => res.json())
      .then((data: Capabilities) => {
        if (!cancelled) {
          setCaps({
            cloudSync: Boolean(data.cloudSync),
            ai: Boolean(data.ai),
            isOwner: Boolean(data.isOwner),
            selfHostHint:
              typeof data.selfHostHint === "string" && data.selfHostHint
                ? data.selfHostHint
                : SELF_HOST_HINT,
          });
          setLoaded(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCaps(FALLBACK);
          setLoaded(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [authLoaded, userId]);

  return { caps, loaded };
}
