const useNotification = () => {
    const requestNotificationPermission = async () => {
        if (!("Notification" in window)) {
            throw Error("Notification API not supported");
        }
        const permission = await Notification.requestPermission();
        return permission;
    };
    const verifyPermission = async () => {
        try {
            // Test if the browser supports notifications
            if (!("Notification" in window)) {
                console.log("This browser does not support desktop notification");
                return false;
            }
            let currentPermission = Notification.permission;
            return currentPermission;
        } catch (error) {
            console.error("Error verifying notification permission:", error);
            return false;
        }
    }

    let defaultIconUrl = `${window.location.origin}/favicon/apple-touch-icon.png`;
    function createNotification(title, bodyText, iconUrl = defaultIconUrl) {
        const options = {
            body: bodyText,
            icon: iconUrl // Optional: URL for an icon
        };
        // Create a new notification (this works only if permission is granted)
        new Notification(title, options);
    }

    function isBrowserMinimized() {
        return document.hidden || document.visibilityState !== 'visible';
    }
    return { verifyPermission, requestNotificationPermission, createNotification, isBrowserMinimized };
}

export default useNotification;