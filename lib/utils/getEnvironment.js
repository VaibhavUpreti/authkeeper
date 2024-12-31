export function getEnvironment() {
    if (typeof window !== "undefined" && typeof window.document !== "undefined") {
        return "browser";
    } else {
        return "server";
    }
}