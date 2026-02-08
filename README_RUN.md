# 🚴 E-VIBE Commute Run

A visual side-scrolling game that promotes sustainable mobility through pure gameplay—no quizzes, no questions, just immersive eco-friendly action!

## 🎮 Quick Start (3 Steps)

### 1. Create React App
```bash
npx create-react-app evibe-run
cd evibe-run
```

### 2. Replace App.js
Copy the entire content of `evibe-commute-run.jsx` into `src/App.js`

### 3. Run
```bash
npm start
```

Game opens at http://localhost:3000

---

## ✨ What Makes This Special

### Pure Visual Learning
- **No text choices** - Players learn through visual cause and effect
- **Dynamic backgrounds** - City transforms from grey to green as you play sustainably
- **Instant feedback** - Every action has immediate visual consequences
- **No lectures** - Understanding builds naturally through gameplay

### Game Features
- 🎯 3-lane side-scrolling action
- ☀️ Collect solar energy for points and eco-score
- 🔋 Grab batteries for power boosts
- 🍃 Pick up leaves to make the environment greener
- ⛽ Avoid pollution obstacles
- 📊 Automatic data tracking for research
- 🛍️ Direct link to E-VIBE product page

---

## 🎮 Controls

**Desktop**: Arrow keys ⬅️ ➡️  
**Mobile**: Tap left/right side of screen

---

## 📊 What Gets Tracked

Game automatically collects:
- Total play time
- Final score
- Clean energy items collected (solar/battery/leaf)
- Obstacle hits
- Whether user clicked "Explore E-VIBE"
- Money saved, pollution avoided, distance covered

Downloads as CSV for easy analysis!

---

## 🛍️ Connect to Your Store

To redirect to your Shopify page, edit line ~295:

```javascript
const handleExploreClick = () => {
  setAnalytics(a => ({ ...a, exploreClicked: true }));
  
  // Replace with your store URL
  window.location.href = 'https://your-store.com/products/evibe';
};
```

---

## 🎨 Visual Style

**Aesthetic**: Eco-futuristic, vibrant, energetic  
**Colors**: Emerald greens, teal blues, sunny yellows  
**Fonts**: Fredoka (playful), Poppins (clean)  
**Vibe**: Hopeful, optimistic, empowering

---

## 📦 Dependencies

**Only React** - No external libraries needed!

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
```

---

## 🌐 Deploy

### Netlify (Easiest)
```bash
npm run build
# Upload 'build' folder to netlify.com/drop
```

### Vercel
```bash
npm install -g vercel
npm run build
vercel
```

---

## 📱 Mobile Ready

✅ Touch controls  
✅ Responsive design  
✅ Works on iOS & Android  
✅ No app store needed

---

## 🎯 Perfect For

- 📚 Academic research on behavioral change
- 🌱 Sustainability education
- 🎮 Gamified product marketing
- 🔬 A/B testing consumer engagement
- 📊 Data-driven persuasion studies

---

## 🎓 Research Use

This game measures:
1. **Engagement**: How long users play
2. **Preference**: Which items they prioritize
3. **Learning**: How collision rates decrease
4. **Intent**: Clicks on product exploration

Export analytics as CSV for analysis in Excel, SPSS, R, or Python.

---

## 📖 Full Documentation

See `EVIBE_RUN_DOCUMENTATION.md` for:
- Complete gameplay mechanics
- Customization guide
- Analytics details
- Design philosophy
- Troubleshooting

---

## 🎨 Customize

**Game duration**:
```javascript
const GAME_DURATION = 120; // seconds
```

**Point values**:
```javascript
{ type: 'sun', points: 10 }  // Change here
```

**Difficulty**:
```javascript
setSpeed(s => Math.min(8, 3 + (gameTime / 30)));
```

---

## 🐛 Common Issues

**Laggy?** → Reduce spawn frequency  
**Too easy?** → Increase obstacle spawn rate  
**Background not changing?** → Check eco-score updates

---

## 📧 Support

**Email**: allaboutdiksha@gmail.com  
**For**: Technical help, research collaboration, feedback

---

## 🌍 Impact

Every play session:
- ✅ Shows benefits of clean energy
- ✅ Demonstrates cost savings
- ✅ Visualizes environmental impact
- ✅ Encourages sustainable transport choices

**No preaching. Just playing. Pure persuasion through experience.**

---

Made with 💚 for a sustainable future
