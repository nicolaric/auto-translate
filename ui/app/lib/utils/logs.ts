export function logEvent(name: string, data: unknown) {
    fetch("https://auto-translate.com/api/tracking", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            event: name,
            data,
        }),
    });
}
