 export function darkenRGB(rgb, darken) {
    if (typeof rgb !== "string") {
        console.error("Invalid input to darkenRGB:", rgb);
        return "rgb(0, 0, 0)";
    }

    const match = rgb.match(/\d+(\.\d+)?/g);
    if (!match || match.length < 3) return rgb;

    const r = Math.max(0, parseInt(match[0], 10) - darken);
    const g = Math.max(0, parseInt(match[1], 10) - darken);
    const b = Math.max(0, parseInt(match[2], 10) - darken);
    const a = match[3] !== undefined ? parseFloat(match[3]) : undefined;

    if (a !== undefined) {
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    } else {
        return `rgb(${r}, ${g}, ${b})`;
    }
}