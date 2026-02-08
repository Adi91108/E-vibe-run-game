# E-VIBE Commute Run - Complete Documentation

## 🎮 Game Overview

**E-VIBE Commute Run** is a side-scrolling visual game that promotes sustainable mobility through pure gameplay mechanics. No quizzes, no text choices—just immersive visual feedback that teaches environmental consciousness through play.

---

## ✨ Key Features

### Pure Visual Gameplay
- **No text-based decisions** - Learning happens through cause and effect
- **Visual feedback system** - Clean energy creates smooth, vibrant gameplay
- **Dynamic environment** - Background transforms from grey to green based on eco-score
- **Immediate consequences** - Pollution slows you down, clean energy speeds you up

### Game Mechanics
- **3-lane system**: Cycle Lane (left) | Bike Lane (middle) | Car Lane (right)
- **Auto-scrolling road** with continuous forward movement
- **Left/Right controls** to switch lanes
- **2-minute gameplay** session for quick engagement
- **Progressive difficulty** - Speed and obstacle frequency increase over time

### Collectibles (Positive)
| Item | Points | Effect |
|------|--------|--------|
| ☀️ Sun | +10 | Yellow glow effect, +5% eco-score |
| 🔋 Battery | +7 | Blue spark effect, +3% eco-score |
| 🍃 Leaf | +5 | Green bloom effect, +2% eco-score |

### Obstacles (Negative)
| Item | Impact | Effect |
|------|--------|--------|
| ⛽ Fuel Pump | -10 points | Red flash, -3% eco-score |
| 💨 Smoke | Slows speed | Grey overlay for 2 seconds |
| 🚧 Traffic | Shake screen | Visual shake effect |

---

## 🎯 Visual Learning System

### Background Transformation
The game background dynamically shifts based on eco-score:
- **Low eco-score** (0-30%): Dark, polluted grey-blue cityscape
- **Medium eco-score** (30-70%): Transitioning green with hints of blue
- **High eco-score** (70-100%): Vibrant green, healthy environment

### Player Bicycle Glow
The player's bicycle emits a green glow that intensifies with higher eco-scores, providing constant visual feedback on sustainable choices.

### Visual Effects
- **Collection effects**: Colorful particle bursts when collecting items
- **Obstacle effects**: Screen shake, red flashes, slow-motion for pollution
- **Smooth transitions**: All visual changes happen gradually for natural learning

---

## 📊 Data Collection & Analytics

### Automatic Tracking
The game automatically tracks:
- `totalPlayTime` - Total seconds played
- `finalScore` - Points earned
- `solarPickups` - Number of sun icons collected
- `batteryPickups` - Number of batteries collected
- `leafPickups` - Number of leaves collected
- `obstacleHits` - Number of times player hit obstacles
- `exploreClicked` - Boolean: Did user click "Explore E-VIBE"?
- `startTime` - ISO timestamp of game start
- `endTime` - ISO timestamp of game end

### Derived Metrics
- **Money Saved**: `score × 0.5` (in rupees)
- **Pollution Avoided**: `ecoScore × 2` (in grams CO₂)
- **Distance Covered**: `gameTime × 0.5` (in kilometers)

### Data Export
Players can download their analytics as CSV after the game:
```csv
Metric,Value
Total Play Time,120s
Final Score,245
Solar Pickups,15
Battery Pickups,12
Leaf Pickups,8
Obstacle Hits,3
Explore Button Clicked,Yes
Money Saved,₹122
Pollution Avoided,164g CO₂
Distance Covered,60 km
```

---

## 🚀 Installation & Setup

### Dependencies
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
```

**Note**: This game uses only React core—no external libraries needed!

### Quick Start

#### Option 1: Create React App
```bash
# Create project
npx create-react-app evibe-run
cd evibe-run

# Copy the game
# Replace src/App.js with evibe-commute-run.jsx content

# Run
npm start
```

#### Option 2: Add to Existing Project
```bash
# Copy evibe-commute-run.jsx to your src/ folder
# Import and use:
import EVIBECommuteRun from './evibe-commute-run';

function App() {
  return <EVIBECommuteRun />;
}
```

---

## 🎨 Design Philosophy

### Eco-Futuristic Aesthetic
- **Color palette**: Emerald greens, teal blues, vibrant yellows
- **Typography**: Playful "Fredoka" for headings, clean "Poppins" for body
- **Rounded corners**: Soft, friendly 3rem border-radius throughout
- **Gradients everywhere**: Multi-color gradients for depth and energy
- **Neon glow effects**: Glowing elements that respond to eco-score

### Visual Feedback Principles
1. **Immediate**: Every action has instant visual response
2. **Clear**: Positive = bright/smooth, Negative = dark/shake
3. **Progressive**: Environment improves as player makes better choices
4. **Rewarding**: Satisfying animations for good decisions

---

## 🎮 Controls

### Desktop
- **Arrow Left** ⬅️ - Move to left lane
- **Arrow Right** ➡️ - Move to right lane

### Mobile
- **Tap left side of screen** - Move to left lane
- **Tap right side of screen** - Move to right lane

---

## 🛍️ E-commerce Integration

### Shopify Connection
At the end of the game, players see:
- Summary of their sustainable ride
- "Explore E-VIBE" button

To connect to your Shopify store:

```javascript
const handleExploreClick = () => {
  setAnalytics(a => ({ ...a, exploreClicked: true }));
  
  // Replace with your actual Shopify product URL
  window.location.href = 'https://your-store.myshopify.com/products/e-vibe-solar-bicycle';
};
```

### Current Behavior
Currently shows an alert and downloads analytics. Replace this with your actual product page redirect.

---

## 📈 Research & Academic Use

### Behavioral Metrics
This game is designed to measure:
1. **Engagement duration** - How long users play
2. **Sustainable choice preference** - Solar vs battery vs leaf collection rates
3. **Obstacle avoidance learning** - Decrease in hits over time
4. **Purchase intention** - Clicks on "Explore E-VIBE" button

### A/B Testing Possibilities
- Different visual styles (dark vs bright backgrounds)
- Varying point values for collectibles
- Different obstacle penalties
- Alternative end-screen messaging

### Data Analysis
Export CSV files can be analyzed using:
- **Excel/Google Sheets**: For basic statistics
- **SPSS**: For behavioral analysis
- **Python/R**: For advanced statistical modeling

---

## 🎯 Educational Impact

### Learning Through Play
Players unconsciously learn:
- ✅ Clean energy = smooth, fast, rewarding experience
- ✅ Pollution = slow, jarring, penalizing experience
- ✅ Sustainable choices improve environment (visual background shift)
- ✅ Economic benefits (money saved metric)
- ✅ Health benefits (distance covered without pollution)

### No Explicit Teaching
Unlike the quiz-based E-VIBE game, this version teaches through:
- **Operant conditioning**: Positive/negative reinforcement
- **Visual association**: Green = good, red/grey = bad
- **Environmental storytelling**: Background transformation shows impact
- **Implicit learning**: Understanding builds without conscious effort

---

## 🔧 Customization Options

### Adjust Game Duration
```javascript
const GAME_DURATION = 120; // Change to 60, 180, etc.
```

### Modify Point Values
```javascript
// In spawnItem function
{ type: 'sun', emoji: '☀️', points: 10 }, // Change points here
{ type: 'battery', emoji: '🔋', points: 7 },
{ type: 'leaf', emoji: '🍃', points: 5 }
```

### Change Spawn Rates
```javascript
// Item spawn rate (lower = more frequent)
itemSpawnRef.current = setInterval(() => {
  if (Math.random() > 0.3) { // Change 0.3 to adjust
    spawnItem();
  }
}, 1500); // Change 1500ms to adjust frequency
```

### Adjust Difficulty Curve
```javascript
// Speed increase formula
setSpeed(s => Math.min(8, 3 + (gameTime / 30)));
// Slower: gameTime / 60
// Faster: gameTime / 15
```

---

## 🌐 Deployment

### Recommended Hosting
1. **Netlify** (Easiest)
   ```bash
   npm run build
   # Drag 'build' folder to netlify.com/drop
   ```

2. **Vercel** (GitHub integration)
   ```bash
   npm install -g vercel
   npm run build
   vercel
   ```

3. **GitHub Pages**
   ```bash
   npm install gh-pages
   npm run deploy
   ```

### Mobile Optimization
Game is fully responsive and touch-enabled:
- ✅ Tap controls for mobile
- ✅ Responsive text sizing
- ✅ Touch-optimized UI elements
- ✅ Works on iOS and Android

---

## 🎨 Visual Style Guide

### Color Palette
```css
Primary Green: #10b981 (Emerald 500)
Secondary Teal: #14b8a6 (Teal 500)
Accent Yellow: #fbbf24 (Amber 400)
Background Dark: #1e3a8a (Blue 900)
Pollution Grey: #6b7280 (Gray 500)
Danger Red: #ef4444 (Red 500)
```

### Fonts
- **Headings**: Fredoka (Google Fonts) - Playful, rounded
- **Body**: Poppins (Google Fonts) - Clean, modern
- **Fallback**: System fonts for performance

### Animation Speeds
- **Lane switches**: 300ms ease-out
- **Visual effects**: 500ms
- **Background transitions**: 500ms ease
- **Item movement**: 50ms update rate

---

## 📱 Browser Compatibility

Tested and working on:
- ✅ Chrome 90+ (Desktop & Mobile)
- ✅ Firefox 88+
- ✅ Safari 14+ (iOS & macOS)
- ✅ Edge 90+
- ✅ Samsung Internet
- ✅ Opera

---

## 🐛 Troubleshooting

### Issue: Game feels laggy
**Solution**: Reduce the number of simultaneous items/obstacles
```javascript
// Reduce spawn frequency
itemSpawnRef.current = setInterval(() => {
  spawnItem();
}, 2000); // Increased from 1500
```

### Issue: Too easy/hard
**Solution**: Adjust obstacle spawn rate and point values

### Issue: Background not changing
**Solution**: Check that eco-score is updating properly
```javascript
console.log('Eco Score:', ecoScore); // Add for debugging
```

### Issue: Touch controls not working on mobile
**Solution**: Ensure the game container has proper touch event handlers (already implemented)

---

## 📊 Analytics Integration

### Google Analytics (Optional)
Add tracking for key events:
```javascript
// On game start
gtag('event', 'game_start', {
  event_category: 'engagement'
});

// On game end
gtag('event', 'game_complete', {
  event_category: 'engagement',
  value: score
});

// On explore button click
gtag('event', 'explore_evibe_click', {
  event_category: 'conversion'
});
```

---

## 🎓 Academic Citation

If using this game for research, suggested citation format:

```
E-VIBE Commute Run (2025). A gamified sustainability intervention 
for promoting solar electric bicycle adoption through visual gameplay. 
Academic Sustainability Project.
```

---

## 📧 Support & Contact

For technical issues or research collaboration:
- Email: **allaboutdiksha@gmail.com**
- Include: Screenshots, browser console errors, device info

---

## 📝 License

Created for academic sustainability research.
Free to use for educational and research purposes.

---

**Made with 💚 for a cleaner, greener future**
