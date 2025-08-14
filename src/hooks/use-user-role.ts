
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function useUserRole() {
  const searchParams = useSearchParams();
  const [role, setRole] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const roleFromParams = searchParams.get('role');
    if (roleFromParams) {
      setRole(decodeURIComponent(roleFromParams));
    }
    setIsLoaded(true);
  }, [searchParams]);

  return { role, isLoaded };
}
