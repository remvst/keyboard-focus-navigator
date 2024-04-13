import { Vector2Like, distance, modulo, normalizeAngle } from "./utils";

export class HandlerMap {
    [key: string]: (navigator: KeyboardNavigator) => void;
}

export class KeyboardNavigator {

    static readonly ARROW_KEY_HANDLERS: HandlerMap = {
        'arrowleft': (n) => n.rotateFocusXY(-1, 0),
        'arrowright': (n) => n.rotateFocusXY(1, 0),
        'arrowup': (n) => n.rotateFocusXY(0, -1),
        'arrowdown': (n) => n.rotateFocusXY(0, 1),
    };

    static readonly WASD_HANDLERS: HandlerMap = {
        'a': (n) => n.rotateFocusXY(-1, 0),
        'd': (n) => n.rotateFocusXY(1, 0),
        'w': (n) => n.rotateFocusXY(0, -1),
        's': (n) => n.rotateFocusXY(0, 1),
    };

    private handlerMap: HandlerMap = {};
    private keyDownListener = (event: KeyboardEvent) => this.keyDown(event);

    constructor(
        readonly view: HTMLElement,
    ) {

    }

    setup() {
        window.addEventListener("keydown", this.keyDownListener, false);
    }

    handleKeys(handlerMap: HandlerMap) {
        this.handlerMap = {
            ...this.handlerMap,
            ...handlerMap,
        }
    }

    destroy() {
        window.removeEventListener("keydown", this.keyDownListener);
    }

    private keyDown(event: KeyboardEvent) {
        const handler = this.handlerMap[event.key.toLowerCase()];
        if (!handler) return;
        handler(this);
    }

    private get allFocusables(): HTMLElement[] {
        const focusables = Array.from(this.view.querySelectorAll('*[tabIndex]')) as HTMLElement[];
        return focusables.filter((element) => element.offsetParent !== null && element.getAttribute('disabled') === null);
    }

    get focusIndex(): number {
        const { allFocusables } = this;
        if (!allFocusables.length) {
            return 0;
        }

        const focused = document.activeElement as HTMLElement;
        return focused ? allFocusables.indexOf(focused) : 0;
    }

    set focusIndex(focusIndex: number) {
        const { allFocusables } = this;
        if (!allFocusables.length) {
            return;
        }

        allFocusables[modulo(focusIndex, allFocusables.length)].focus();
    }

    rotateFocus(direction: number) {
        if (!document.activeElement || document.activeElement.getAttribute('tabindex') === null) {
            this.focusIndex = 0;
            return;
        }

        this.focusIndex += direction;
    }

    rotateFocusXY(dx: number, dy: number) {
        if (!document.activeElement || document.activeElement.getAttribute('tabindex') === null) {
            this.focusIndex = 0;
            return;
        }

        const currentFocus = document.activeElement as HTMLElement;

        const otherFocusables = this.allFocusables.filter(focusable => focusable !== currentFocus);
        if (!otherFocusables.length) return;

        const directionAngle = normalizeAngle(Math.atan2(dy, dx));

        const elementsInSequence = this.allFocusables.filter((focusable) => {
            if (focusable === currentFocus) return true;

            const angleToFocusable = this.angleBetween(currentFocus, focusable);
            const angleDiff = Math.abs(normalizeAngle(angleToFocusable - directionAngle));

            return Math.min(angleDiff, Math.PI - angleDiff) < Math.PI / 16;
        });

        const distanceScore = (focusable: HTMLElement) => {
            const dist = distance(this.centerOf(focusable), this.centerOf(currentFocus));
            const angleToFocusable = this.angleBetween(currentFocus, focusable);
            const angleDiff = Math.abs(normalizeAngle(angleToFocusable - directionAngle));

            return angleDiff > Math.PI / 2
                ? -dist
                : dist;
        };

        const sequenceSortedByDistance = elementsInSequence.sort((a, b) => distanceScore(a) - distanceScore(b));

        const currentFocusIndex = sequenceSortedByDistance.indexOf(currentFocus);
        if (currentFocusIndex === sequenceSortedByDistance.length - 1) {
            sequenceSortedByDistance[0]?.focus();
        } else {
            sequenceSortedByDistance[currentFocusIndex + 1]?.focus();
        }
    }

    private centerOf(elt: HTMLElement): Vector2Like {
        const rect = elt.getBoundingClientRect();
        return {
            x: rect.x + rect.width / 2,
            y: rect.y + rect.height / 2,
        };
    }

    private angleBetween(
        a: HTMLElement,
        b: HTMLElement,
    ): number {
        const centerA = this.centerOf(a);
        const centerB = this.centerOf(b);

        return normalizeAngle(Math.atan2(centerB.y - centerA.y, centerB.x - centerA.x));
    }
}