// utils/getEnvironment.js
export function getEnvironment() {
    // Check for browser or server environment
    if (typeof window !== "undefined" && typeof window.document !== "undefined") {
        return "browser"; // In the browser
    } else {
        return "server"; // In a server environment
    }
}
