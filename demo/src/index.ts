import { KeyboardFocusNavigator } from "@remvst/keyboard-focus-navigator";

window.addEventListener("load", async () => {
    const navigator = new KeyboardFocusNavigator(document.body);
    navigator.handleKeys(KeyboardFocusNavigator.ARROW_KEY_HANDLERS);
    navigator.handleKeys(KeyboardFocusNavigator.WASD_HANDLERS);
    navigator.setup();
});
