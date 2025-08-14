import * as React from "react"

const MOBILE_BREAKPOINT = 768

// This hook is designed to be used to determine if the user is on a mobile device.
// It is safe to use in server components, as it will default to `false` on the server
// and only update on the client after mounting. This prevents hydration mismatches.
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false)
  const [hasMounted, setHasMounted] = React.useState(false)

  React.useEffect(() => {
    setHasMounted(true)
    
    const checkDevice = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    checkDevice()
    window.addEventListener("resize", checkDevice)

    return () => {
      window.removeEventListener("resize", checkDevice)
    }
  }, [])

  return hasMounted && isMobile
}
