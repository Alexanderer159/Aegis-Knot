import { useState, useEffect, useCallback } from "react";

interface CompassState {
  heading: number | null; // degrees, 0 = north, clockwise
  supported: boolean;
  permissionNeeded: boolean;
  permissionGranted: boolean;
  error: string | null;
}

function isIOSPermissionAPI(): boolean {
  return typeof (DeviceOrientationEvent as any)?.requestPermission === "function";
}

export function useCompassHeading() {
  const [state, setState] = useState<CompassState>({
    heading: null,
    supported: typeof window !== "undefined" && "DeviceOrientationEvent" in window,
    permissionNeeded: isIOSPermissionAPI(),
    permissionGranted: !isIOSPermissionAPI(), // Android/desktop: no explicit permission step
    error: null,
  });

  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    // iOS gives a direct compass heading (0 = north, clockwise), most accurate when available
    const iosHeading = (event as any).webkitCompassHeading;
    if (typeof iosHeading === "number") {
      setState((prev) => ({ ...prev, heading: iosHeading }));
      return;
    }

    // Standard 'absolute' event: alpha is heading counter-clockwise from device's
    // initial orientation relative to magnetic north, convert to clockwise-from-north
    if (event.alpha !== null) {
      const heading = 360 - event.alpha;
      setState((prev) => ({ ...prev, heading }));
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!isIOSPermissionAPI()) {
      setState((prev) => ({ ...prev, permissionGranted: true }));
      return true;
    }
    try {
      const result = await (DeviceOrientationEvent as any).requestPermission();
      const granted = result === "granted";
      setState((prev) => ({ ...prev, permissionGranted: granted, error: granted ? null : "Permission denied" }));
      return granted;
    } catch (err) {
      setState((prev) => ({ ...prev, error: "Could not request compass permission" }));
      return false;
    }
  }, []);

  useEffect(() => {
    if (!state.supported || !state.permissionGranted) return;

    // Prefer the 'absolute' event where available (Android/Chrome), it's a true
    // compass reading rather than relative-to-start-orientation
    const eventName = "ondeviceorientationabsolute" in window ? "deviceorientationabsolute" : "deviceorientation";
    window.addEventListener(eventName, handleOrientation as EventListener);

    return () => {
      window.removeEventListener(eventName, handleOrientation as EventListener);
    };
  }, [state.supported, state.permissionGranted, handleOrientation]);

  return { ...state, requestPermission };
}