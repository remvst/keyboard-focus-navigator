export interface Vector2Like {
    x: number;
    y: number;
};

export function normalizeAngle(angle: number) {
    let normalized = angle;
    while (normalized < -Math.PI) normalized += Math.PI * 2;
    while (normalized > Math.PI) normalized -= Math.PI * 2;
    return normalized;
};

export function pointDistance(x1: number, y1: number, x2: number, y2: number) {
    return Math.hypot(x1 - x2, y1 - y2);
};

export function distance(a: Vector2Like, b: Vector2Like) {
    return pointDistance(a.x, a.y, b.x, b.y);
};

export function modulo(x: number, mod: number) {
    if (x >= 0) {
        return x % mod;
    }
    return x - mod * Math.floor(x / mod);
};