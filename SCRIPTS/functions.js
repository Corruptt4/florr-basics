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
export function degreesToRads(x) {
    return x * (Math.PI / 180)
}
export function boxCollision(mx, my, bx, by, bl) {
    return (mx >= bx && mx <= bx + bl && my >= by && my <= by + bl)
}
export function boxBoxCollision(bx1, by1, bx2, by2, bl1, bl2) {
    return (bx1 < bx2 + bl2 &&
            bx1 + bl1 > bx2 &&
            by1 < by2 + bl2 &&
            by1 + bl1 > by2);
}
export function abbreviate(num) {

    if (num < 1000) return num

    let abbreviations = [
        "k","m","b","t","qa","qi"
    ]
    let index = Math.floor(Math.log10(num)/3)-1
    let shortNum = (num / Math.pow(10, (index+1)*3))

    return shortNum.toFixed(2) + abbreviations[index]
}