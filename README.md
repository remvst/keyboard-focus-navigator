# keyboard-focus-navigator

Helper to navigate focus between elements of a page using the keyboard.

## Installation

```sh
# NPM
npm install --save @remvst/keyboard-focus-navigator
```

## Usage

Your elements must have a `tabindex` specified:

```html
<button tabindex="0">Button 1</button>
<button tabindex="1">Other button</button>
```

You can then set up the key handlers:

```typescript
import { KeyboardNavigator } from "@remvst/keyboard-focus-navigator";

const navigator = new KeyboardNavigator(document.body);
navigator.handleKeys(KeyboardNavigator.ARROW_KEY_HANDLERS);
navigator.handleKeys(KeyboardNavigator.WASD_HANDLERS);
navigator.setup();
```

Once done, you can destroy the navigator:

```typescript
navigator.destroy();
```

You can also move the focus programmatically:

```typescript
navigator.rotateFocusXY(1, 0); // Move the focus to the right
navigator.rotateFocusXY(-1, 0); // Move the focus to the left
navigator.rotateFocusXY(0, -1); // Move the focus up
navigator.rotateFocusXY(0, 1); // Move the focus down
```
