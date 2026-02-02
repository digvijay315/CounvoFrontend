/**
 * Browser notification hook.
 * Notifications require: HTTPS (secure context), user permission, and browser support.
 * On mobile: support is limited (e.g. iOS Safari 16.4+ partial; Chrome/Firefox Android supported).
 */

const useNotification = () => {
  /**
   * Check if the Notification API is available and in a valid context.
   * Notifications require HTTPS (or localhost) and window.Notification.
   */
  const isSupported = () => {
    if (typeof window === "undefined") return false;
    if (!window.isSecureContext) return false;
    if (!("Notification" in window)) return false;
    return true;
  };

  /**
   * Request permission. Must be called from a user gesture on many browsers (e.g. button click).
   * Returns "granted" | "denied" | "default".
   */
  const requestNotificationPermission = async () => {
    if (!isSupported()) {
      return "denied";
    }
    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (error) {
      console.warn("Notification.requestPermission failed:", error);
      return "denied";
    }
  };

  /**
   * Get current permission without prompting.
   * Returns "granted" | "denied" | "default" | "unsupported".
   */
  const verifyPermission = async () => {
    try {
      if (!isSupported()) {
        return "unsupported";
      }
      return Notification.permission;
    } catch (error) {
      console.warn("Error verifying notification permission:", error);
      return "unsupported";
    }
  };

  /**
   * Show a notification. Safe to call; no-op if unsupported or permission not granted.
   * Wrapped in try/catch so it never throws (e.g. on mobile when API exists but fails).
   */
  const createNotification = (title, bodyText, iconUrl) => {
    if (!title) return;
    if (!isSupported()) return;
    if (Notification.permission !== "granted") return;
    try {
      const defaultIcon =
        typeof window !== "undefined"
          ? `${window.location.origin}/favicon/apple-touch-icon.png`
          : "";
      const options = {
        body: bodyText || "",
        icon: iconUrl || defaultIcon,
        tag: "counvo-notification",
        requireInteraction: false,
      };
      const n = new Notification(title, options);
      // Auto-close after 5s so they don't stack indefinitely
      if (n.close) {
        setTimeout(() => {
          try {
            n.close();
          } catch (_) {}
        }, 5000);
      }
    } catch (error) {
      console.warn("createNotification failed:", error);
    }
  };

  /**
   * True when the page is not visible (tab in background, window minimized, or another tab active).
   */
  const isBrowserMinimized = () => {
    if (typeof document === "undefined") return true;
    return document.hidden || document.visibilityState !== "visible";
  };

  return {
    isSupported,
    verifyPermission,
    requestNotificationPermission,
    createNotification,
    isBrowserMinimized,
  };
};

export default useNotification;
