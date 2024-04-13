import { KeyboardNavigator } from '@remvst/keyboard-focus-navigator';

window.addEventListener("load", async () => {
    const navigator = new KeyboardNavigator(document.body);
    navigator.handleKeys(KeyboardNavigator.ARROW_KEY_HANDLERS);
    navigator.handleKeys(KeyboardNavigator.WASD_HANDLERS);
    navigator.setup();
});
