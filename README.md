# Xbox Wireless Controller UI

An interactive, fully-functional Xbox Wireless Controller user interface built with HTML, CSS, and JavaScript. This is a visual simulation of the Xbox controller with working buttons, analog sticks, and real-time output display.

## Features

✨ **Complete Controller Layout**
- D-Pad (4-directional input)
- Action Buttons (Y, X, B, A)
- Bumpers (LB, RB)
- Triggers (LT, RT)
- Analog Sticks (Left & Right with clickable buttons)
- Menu & View Buttons
- Xbox Logo Button

🖱️ **Multiple Input Methods**
- **Mouse Support**: Click any button or drag analog sticks
- **Touch Support**: Full touchscreen compatibility for mobile devices
- **Keyboard Support**: Use keyboard shortcuts for quick input
  - `W/A/S/D` - D-Pad Up/Left/Down/Right
  - `Y/X/B/Space` - Action Buttons Y/X/B/A
  - `Q/E` - Bumpers LB/RB
  - `T/G` - Triggers LT/RT
  - `V/M` - View/Menu Buttons
  - `Z` - Xbox Button

📊 **Real-Time Output Display**
- Shows button press/release events
- Displays analog stick position values
- Auto-clearing output after 2 seconds of inactivity

🎨 **Authentic Design**
- Realistic Xbox controller styling
- Dark theme with green accent colors (Xbox branding)
- Color-coded buttons (Red Y, Blue X, Red B, Green A)
- Smooth animations and hover effects
- 3D depth with shadows and gradients

📱 **Responsive Design**
- Works on desktop, tablet, and mobile devices
- Adaptive layout for different screen sizes
- Touch-friendly button sizing

## How to Use

1. **Clone the repository**
   ```bash
   git clone https://github.com/corl62/xbox-controller-ui.git
   cd xbox-controller-ui
   ```

2. **Open in a browser**
   - Simply open `index.html` in your web browser
   - No server or build tools required!

3. **Interact with the controller**
   - Click any button to press it
   - Drag the analog sticks to see position changes
   - Use keyboard shortcuts for hands-free operation
   - Watch the output display for real-time feedback

## File Structure

```
xbox-controller-ui/
├── index.html      # Main HTML structure
├── style.css       # Styling and layout
├── script.js       # JavaScript interactivity
└── README.md       # This file
```

## Technical Details

### HTML (`index.html`)
- Semantic structure with controller layout
- All buttons and controls properly labeled
- SVG icon for Xbox logo button

### CSS (`style.css`)
- CSS Grid for button layouts (D-Pad, Action Buttons)
- Flexbox for overall controller structure
- Gradient backgrounds for depth and visual appeal
- Smooth transitions and hover states
- Responsive media queries for mobile devices
- Box shadows for 3D effect

### JavaScript (`script.js`)
- Event listeners for mouse, touch, and keyboard input
- Analog stick position tracking and limiting
- Real-time output display with auto-clear
- Keyboard mapping for quick input
- State management for active buttons and sticks

## Browser Compatibility

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Features In Detail

### Analog Sticks
- Full 360-degree rotational movement
- Position values from -100 to +100 on each axis
- Smooth clamping to prevent over-extension
- Visual feedback with inner stick movement

### Button Feedback
- Visual press animation (color change, scale)
- Text output showing press/release state
- Support for simultaneous button presses
- Auto-clear output after inactivity

### Keyboard Control
Provides accessibility and quick testing:
- Each button has a dedicated key
- No modifier keys required
- Smooth state transitions

## Customization

You can easily customize this controller UI:

- **Colors**: Edit the color values in `style.css` (search for hex colors like `#90EE90`)
- **Button Layout**: Modify the grid positions in `style.css`
- **Button Labels**: Change text in `index.html`
- **Sensitivity**: Adjust `maxDistance` value in `script.js` for stick sensitivity
- **Output Timeout**: Change the 2000ms timeout in `script.js` for output display duration

## Future Enhancements

Potential improvements:
- [ ] Gamepad API integration for real Xbox controllers
- [ ] Haptic feedback simulation
- [ ] Input recording and playback
- [ ] Customizable button mapping
- [ ] Multiple controller layouts (PS5, Switch Pro)
- [ ] Dark/Light theme toggle
- [ ] Audio feedback for button presses

## License

This project is open source and available under the MIT License.

## Credits

Created as an educational project to demonstrate:
- HTML semantic structure
- CSS styling and layout techniques
- JavaScript event handling
- Touch and keyboard input handling
- Responsive design principles

---

**Enjoy your interactive Xbox Controller UI!** 🎮
