import React, { useState, useEffect, useRef, useCallback } from 'react';

const EVIBECommuteRun = () => {
  // Game states
  const [gameState, setGameState] = useState('welcome'); // welcome, playing, ended
  const [score, setScore] = useState(0);
  const [ecoScore, setEcoScore] = useState(0);
  const [gameTime, setGameTime] = useState(0);
  const [playerLane, setPlayerLane] = useState(1); // 0=left, 1=middle, 2=right
  const [speed, setSpeed] = useState(3);
  const [items, setItems] = useState([]);
  const [obstacles, setObstacles] = useState([]);
  const [effects, setEffects] = useState([]);
  const [slowedUntil, setSlowedUntil] = useState(0);
  const [backgroundShift, setBackgroundShift] = useState(0);
  
  // Data tracking
  const [analytics, setAnalytics] = useState({
    totalPlayTime: 0,
    finalScore: 0,
    solarPickups: 0,
    batteryPickups: 0,
    leafPickups: 0,
    obstacleHits: 0,
    exploreClicked: false,
    startTime: null,
    endTime: null
  });

  const gameLoopRef = useRef(null);
  const itemSpawnRef = useRef(null);
  const obstacleSpawnRef = useRef(null);
  const gameAreaRef = useRef(null);

  const GAME_DURATION = 120; // 2 minutes
  const LANE_POSITIONS = [20, 50, 80]; // percentage positions

  // Spawn collectible items
  const spawnItem = useCallback(() => {
    const types = [
      { type: 'sun', emoji: '☀️', points: 10, color: '#fbbf24' },
      { type: 'battery', emoji: '🔋', points: 7, color: '#3b82f6' },
      { type: 'leaf', emoji: '🍃', points: 5, color: '#10b981' }
    ];
    
    const item = types[Math.floor(Math.random() * types.length)];
    const lane = Math.floor(Math.random() * 3);
    
    setItems(prev => [...prev, {
      id: Date.now() + Math.random(),
      ...item,
      lane,
      y: -50
    }]);
  }, []);

  // Spawn obstacles
  const spawnObstacle = useCallback(() => {
    const types = [
      { type: 'fuel', emoji: '⛽', damage: -10, color: '#ef4444' },
      { type: 'smoke', emoji: '💨', effect: 'slow', color: '#6b7280' },
      { type: 'traffic', emoji: '🚧', effect: 'shake', color: '#f97316' }
    ];
    
    const obstacle = types[Math.floor(Math.random() * types.length)];
    const lane = Math.floor(Math.random() * 3);
    
    setObstacles(prev => [...prev, {
      id: Date.now() + Math.random(),
      ...obstacle,
      lane,
      y: -50
    }]);
  }, []);

  // Check collision
  const checkCollision = useCallback((itemY, itemLane) => {
    return itemY > 65 && itemY < 85 && itemLane === playerLane;
  }, [playerLane]);

  // Add visual effect
  const addEffect = useCallback((type, color) => {
    const effectId = Date.now() + Math.random();
    setEffects(prev => [...prev, { id: effectId, type, color }]);
    setTimeout(() => {
      setEffects(prev => prev.filter(e => e.id !== effectId));
    }, 500);
  }, []);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const currentSpeed = Date.now() < slowedUntil ? speed * 0.5 : speed;

    gameLoopRef.current = setInterval(() => {
      // Move items down
      setItems(prev => {
        const updated = prev.map(item => ({ ...item, y: item.y + currentSpeed }));
        
        // Check collisions
        updated.forEach(item => {
          if (checkCollision(item.y, item.lane) && item.y < 90) {
            // Collect item
            setScore(s => s + item.points);
            
            if (item.type === 'sun') {
              setAnalytics(a => ({ ...a, solarPickups: a.solarPickups + 1 }));
              addEffect('glow', item.color);
              setEcoScore(e => Math.min(100, e + 5));
            } else if (item.type === 'battery') {
              setAnalytics(a => ({ ...a, batteryPickups: a.batteryPickups + 1 }));
              addEffect('spark', item.color);
              setEcoScore(e => Math.min(100, e + 3));
            } else if (item.type === 'leaf') {
              setAnalytics(a => ({ ...a, leafPickups: a.leafPickups + 1 }));
              addEffect('bloom', item.color);
              setEcoScore(e => Math.min(100, e + 2));
            }
            
            item.y = 1000; // Remove from screen
          }
        });
        
        return updated.filter(item => item.y < 110);
      });

      // Move obstacles down
      setObstacles(prev => {
        const updated = prev.map(obs => ({ ...obs, y: obs.y + currentSpeed }));
        
        // Check collisions
        updated.forEach(obs => {
          if (checkCollision(obs.y, obs.lane) && obs.y < 90) {
            // Hit obstacle
            if (obs.damage) {
              setScore(s => Math.max(0, s + obs.damage));
              addEffect('hit', obs.color);
              setEcoScore(e => Math.max(0, e - 3));
            }
            
            if (obs.effect === 'slow') {
              setSlowedUntil(Date.now() + 2000);
              addEffect('slow', obs.color);
            }
            
            if (obs.effect === 'shake') {
              addEffect('shake', obs.color);
            }
            
            setAnalytics(a => ({ ...a, obstacleHits: a.obstacleHits + 1 }));
            obs.y = 1000; // Remove from screen
          }
        });
        
        return updated.filter(obs => obs.y < 110);
      });

      // Update background shift based on eco score
      setBackgroundShift(ecoScore);

      // Increase speed gradually
      setSpeed(s => Math.min(8, 3 + (gameTime / 30)));
    }, 50);

    return () => clearInterval(gameLoopRef.current);
  }, [gameState, speed, slowedUntil, checkCollision, addEffect, gameTime, ecoScore]);

  // Item spawning
  useEffect(() => {
    if (gameState !== 'playing') return;

    itemSpawnRef.current = setInterval(() => {
      if (Math.random() > 0.3) {
        spawnItem();
      }
    }, 1500);

    return () => clearInterval(itemSpawnRef.current);
  }, [gameState, spawnItem]);

  // Obstacle spawning
  useEffect(() => {
    if (gameState !== 'playing') return;

    obstacleSpawnRef.current = setInterval(() => {
      if (Math.random() > 0.5) {
        spawnObstacle();
      }
    }, 2000 - Math.min(1000, gameTime * 10));

    return () => clearInterval(obstacleSpawnRef.current);
  }, [gameState, spawnObstacle, gameTime]);

  // Game timer
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setGameTime(t => {
        const newTime = t + 1;
        if (newTime >= GAME_DURATION) {
          endGame();
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  // Keyboard controls
  useEffect(() => {
    if (gameState !== 'playing') return;

    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') {
        setPlayerLane(l => Math.max(0, l - 1));
      } else if (e.key === 'ArrowRight') {
        setPlayerLane(l => Math.min(2, l + 1));
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setEcoScore(0);
    setGameTime(0);
    setPlayerLane(1);
    setSpeed(3);
    setItems([]);
    setObstacles([]);
    setEffects([]);
    setBackgroundShift(0);
    setAnalytics({
      totalPlayTime: 0,
      finalScore: 0,
      solarPickups: 0,
      batteryPickups: 0,
      leafPickups: 0,
      obstacleHits: 0,
      exploreClicked: false,
      startTime: new Date().toISOString(),
      endTime: null
    });
  };

  const endGame = () => {
    setGameState('ended');
    setAnalytics(a => ({
      ...a,
      totalPlayTime: gameTime,
      finalScore: score,
      endTime: new Date().toISOString()
    }));
  };

  const handleExploreClick = () => {
    setAnalytics(a => ({ ...a, exploreClicked: true }));
    // downloadAnalytics();
    // Redirect after a short delay to ensure download starts
    setTimeout(() => {
      window.location.href = 'https://e-vibe-five.vercel.app/';
    }, 500);
  };

  const downloadAnalytics = () => {
    const data = {
      ...analytics,
      moneySaved: Math.round(score * 0.5),
      pollutionAvoided: Math.round(ecoScore * 2),
      distanceCovered: Math.round(gameTime * 0.5)
    };

    const csv = `Metric,Value
Total Play Time,${data.totalPlayTime}s
Final Score,${data.finalScore}
Solar Pickups,${data.solarPickups}
Battery Pickups,${data.batteryPickups}
Leaf Pickups,${data.leafPickups}
Obstacle Hits,${data.obstacleHits}
Explore Button Clicked,${data.exploreClicked ? 'Yes' : 'No'}
Money Saved,₹${data.moneySaved}
Pollution Avoided,${data.pollutionAvoided}g CO₂
Distance Covered,${data.distanceCovered} km
Start Time,${data.startTime}
End Time,${data.endTime}`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `evibe-run-analytics-${Date.now()}.csv`;
    a.click();
  };

  // Welcome Screen
  if (gameState === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-400 via-emerald-400 to-green-500 flex items-center justify-center p-4 overflow-hidden relative">
        {/* Animated clouds */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="cloud cloud-1"></div>
          <div className="cloud cloud-2"></div>
          <div className="cloud cloud-3"></div>
        </div>

        <div className="max-w-2xl w-full relative z-10">
          <div className="bg-white/95 backdrop-blur-xl rounded-[3rem] shadow-2xl p-12 border-4 border-emerald-300">
            {/* Title */}
            <div className="text-center mb-8">
              <div className="inline-block mb-4">
                <div className="text-8xl mb-4 animate-bounce">🚴</div>
              </div>
              <h1 className="font-fredoka text-6xl font-black mb-4 bg-gradient-to-r from-emerald-600 via-teal-500 to-green-600 bg-clip-text text-transparent leading-tight">
                E-VIBE
              </h1>
              <h2 className="font-fredoka text-4xl font-bold text-gray-800 mb-2">
                Commute Run
              </h2>
              <p className="font-poppins text-xl text-gray-600">
                Ride clean. Ride green. 🌿
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl p-8 mb-8 border-2 border-emerald-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">How to Play</h3>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-5xl mb-2">☀️</div>
                  <p className="text-sm font-semibold text-gray-700">Collect Solar</p>
                  <p className="text-xs text-green-600">+10 points</p>
                </div>
                <div className="text-center">
                  <div className="text-5xl mb-2">🔋</div>
                  <p className="text-sm font-semibold text-gray-700">Grab Batteries</p>
                  <p className="text-xs text-blue-600">+7 points</p>
                </div>
                <div className="text-center">
                  <div className="text-5xl mb-2">🍃</div>
                  <p className="text-sm font-semibold text-gray-700">Get Leaves</p>
                  <p className="text-xs text-emerald-600">+5 points</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-5xl mb-2">⛽</div>
                  <p className="text-sm font-semibold text-gray-700">Avoid Fuel</p>
                  <p className="text-xs text-red-600">-10 points</p>
                </div>
                <div className="text-center">
                  <div className="text-5xl mb-2">💨</div>
                  <p className="text-sm font-semibold text-gray-700">Dodge Smoke</p>
                  <p className="text-xs text-gray-600">Slows you</p>
                </div>
                <div className="text-center">
                  <div className="text-5xl mb-2">🚧</div>
                  <p className="text-sm font-semibold text-gray-700">Skip Traffic</p>
                  <p className="text-xs text-orange-600">Shakes screen</p>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-gray-800 text-white rounded-2xl p-6 mb-8">
              <p className="text-center font-bold text-lg mb-3">🎮 Controls</p>
              <div className="flex justify-center gap-8">
                <div className="text-center">
                  <div className="text-3xl mb-1">⬅️</div>
                  <p className="text-sm">Move Left</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-1">➡️</div>
                  <p className="text-sm">Move Right</p>
                </div>
              </div>
              <p className="text-center text-xs text-gray-400 mt-3">On mobile: Tap left/right side of screen</p>
            </div>

            {/* Start Button */}
            <button
              onClick={startGame}
              className="font-fredoka w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 text-white text-3xl font-black py-6 px-8 rounded-3xl hover:from-emerald-600 hover:via-teal-600 hover:to-green-600 transition-all duration-300 shadow-2xl hover:shadow-emerald-500/50 transform hover:scale-105 active:scale-95"
            >
              START RIDE 🚀
            </button>
          </div>
        </div>

        <style jsx>{`
          .cloud {
            position: absolute;
            background: white;
            border-radius: 100px;
            opacity: 0.6;
          }
          .cloud::before, .cloud::after {
            content: '';
            position: absolute;
            background: white;
            border-radius: 100px;
          }
          .cloud-1 {
            width: 100px;
            height: 40px;
            top: 20%;
            animation: float 20s infinite linear;
          }
          .cloud-1::before {
            width: 50px;
            height: 50px;
            top: -25px;
            left: 10px;
          }
          .cloud-1::after {
            width: 60px;
            height: 40px;
            top: -15px;
            right: 10px;
          }
          .cloud-2 {
            width: 120px;
            height: 50px;
            top: 50%;
            animation: float 25s infinite linear;
          }
          .cloud-2::before {
            width: 60px;
            height: 60px;
            top: -30px;
            left: 15px;
          }
          .cloud-2::after {
            width: 70px;
            height: 50px;
            top: -20px;
            right: 15px;
          }
          .cloud-3 {
            width: 90px;
            height: 35px;
            top: 70%;
            animation: float 30s infinite linear;
          }
          .cloud-3::before {
            width: 45px;
            height: 45px;
            top: -20px;
            left: 12px;
          }
          .cloud-3::after {
            width: 55px;
            height: 35px;
            top: -15px;
            right: 12px;
          }
          @keyframes float {
            0% { transform: translateX(-100vw); }
            100% { transform: translateX(100vw); }
          }
        `}</style>
      </div>
    );
  }

  // Playing Screen
  if (gameState === 'playing') {
    const bgColor = `hsl(${120 + backgroundShift * 0.5}, ${50 + backgroundShift * 0.3}%, ${30 + backgroundShift * 0.4}%)`;
    const hasShakeEffect = effects.some(e => e.type === 'shake');

    return (
      <div 
        ref={gameAreaRef}
        className="min-h-screen relative overflow-hidden select-none"
        style={{
          background: `linear-gradient(to bottom, ${bgColor}, #1e3a8a)`,
          transition: 'background 0.5s ease'
        }}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const width = rect.width;
          if (clickX < width / 2) {
            setPlayerLane(l => Math.max(0, l - 1));
          } else {
            setPlayerLane(l => Math.min(2, l + 1));
          }
        }}
      >
        {/* Background city buildings */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
          <div className="building-container">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="building"
                style={{
                  left: `${i * 15}%`,
                  height: `${40 + Math.random() * 40}%`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        </div>

        {/* Road lanes */}
        <div className="absolute inset-0 flex justify-around px-8 py-20">
          {[0, 1, 2].map(lane => (
            <div key={lane} className="relative w-1/3 h-full">
              {/* Lane marker */}
              <div className="absolute left-1/2 top-0 w-1 h-full bg-white/30 lane-marker"></div>
              
              {/* Lane label (at top) */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white/60 text-sm font-bold">
                {lane === 0 ? '🚴 Cycle' : lane === 1 ? '🚲 Bike' : '🚗 Car'}
              </div>
            </div>
          ))}
        </div>

        {/* Collectible items */}
        {items.map(item => (
          <div
            key={item.id}
            className="absolute text-6xl animate-pulse"
            style={{
              left: `${LANE_POSITIONS[item.lane]}%`,
              top: `${item.y}%`,
              transform: 'translate(-50%, -50%)',
              transition: 'left 0.3s ease',
              filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.8))'
            }}
          >
            {item.emoji}
          </div>
        ))}

        {/* Obstacles */}
        {obstacles.map(obs => (
          <div
            key={obs.id}
            className="absolute text-6xl"
            style={{
              left: `${LANE_POSITIONS[obs.lane]}%`,
              top: `${obs.y}%`,
              transform: 'translate(-50%, -50%)',
              transition: 'left 0.3s ease',
              filter: 'drop-shadow(0 0 15px rgba(0,0,0,0.5))'
            }}
          >
            {obs.emoji}
          </div>
        ))}

        {/* Player bicycle */}
        <div
          className="absolute text-7xl transition-all duration-300 ease-out"
          style={{
            left: `${LANE_POSITIONS[playerLane]}%`,
            top: '75%',
            transform: hasShakeEffect 
              ? 'translate(-50%, -50%) rotate(-5deg)' 
              : 'translate(-50%, -50%)',
            filter: `drop-shadow(0 0 ${20 + ecoScore * 0.3}px rgba(16, 185, 129, 0.8))`,
            animation: hasShakeEffect ? 'shake 0.5s' : 'none'
          }}
        >
          🚴
        </div>

        {/* Visual effects overlay */}
        {effects.map(effect => (
          <div
            key={effect.id}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: effect.type === 'hit' 
                ? `radial-gradient(circle, ${effect.color}40 0%, transparent 70%)`
                : effect.type === 'glow'
                ? `radial-gradient(circle at 50% 75%, ${effect.color}60 0%, transparent 50%)`
                : effect.type === 'spark'
                ? `radial-gradient(circle at 50% 75%, ${effect.color}50 0%, transparent 40%)`
                : `radial-gradient(circle at 50% 75%, ${effect.color}40 0%, transparent 60%)`,
              animation: 'fadeOut 0.5s ease-out'
            }}
          />
        ))}

        {/* HUD - Top */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-10">
          <div className="bg-black/60 backdrop-blur-md rounded-2xl px-6 py-3 border-2 border-white/20">
            <p className="text-white/70 text-sm font-bold mb-1">SCORE</p>
            <p className="text-white text-4xl font-black">{score}</p>
          </div>

          <div className="bg-black/60 backdrop-blur-md rounded-2xl px-6 py-3 border-2 border-white/20">
            <p className="text-white/70 text-sm font-bold mb-1">TIME</p>
            <p className="text-white text-4xl font-black">{GAME_DURATION - gameTime}s</p>
          </div>
        </div>

        {/* Eco meter */}
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-black/60 backdrop-blur-md rounded-full px-8 py-3 border-2 border-white/20">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌍</span>
              <div className="w-48 h-4 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500 rounded-full"
                  style={{ width: `${ecoScore}%` }}
                />
              </div>
              <span className="text-white font-bold text-sm">{Math.round(ecoScore)}%</span>
            </div>
          </div>
        </div>

        <style jsx>{`
          .lane-marker {
            background: repeating-linear-gradient(
              to bottom,
              white 0px,
              white 20px,
              transparent 20px,
              transparent 40px
            );
            animation: scrollDown 1s linear infinite;
          }
          
          @keyframes scrollDown {
            0% { background-position: 0 0; }
            100% { background-position: 0 40px; }
          }
          
          .building-container {
            position: relative;
            width: 100%;
            height: 100%;
          }
          
          .building {
            position: absolute;
            bottom: 0;
            width: 12%;
            background: linear-gradient(to bottom, #1e293b, #0f172a);
            border-radius: 8px 8px 0 0;
            animation: buildingScroll 3s linear infinite;
          }
          
          @keyframes buildingScroll {
            0% { transform: translateY(0); opacity: 1; }
            100% { transform: translateY(20px); opacity: 0.5; }
          }
          
          @keyframes shake {
            0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
            25% { transform: translate(-50%, -50%) rotate(-5deg); }
            75% { transform: translate(-50%, -50%) rotate(5deg); }
          }
          
          @keyframes fadeOut {
            0% { opacity: 1; }
            100% { opacity: 0; }
          }
        `}</style>
      </div>
    );
  }

  // End Screen
  if (gameState === 'ended') {
    const moneySaved = Math.round(score * 0.5);
    const pollutionAvoided = Math.round(ecoScore * 2);
    const distanceCovered = Math.round(gameTime * 0.5);

    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-green-900 flex items-center justify-center p-4">
        <div className="max-w-3xl w-full">
          <div className="bg-white/95 backdrop-blur-xl rounded-[3rem] shadow-2xl p-12 border-4 border-emerald-400">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="text-8xl mb-4">🏆</div>
              <h2 className="font-fredoka text-5xl font-black mb-4 text-gray-800">
                Ride Complete!
              </h2>
              <p className="font-poppins text-xl text-gray-600">
                This is what daily travel with E-VIBE feels like.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-green-100 to-emerald-200 rounded-3xl p-6 text-center border-2 border-green-300">
                <div className="text-5xl mb-2">💰</div>
                <p className="text-gray-600 text-sm font-semibold mb-1">Money Saved</p>
                <p className="text-3xl font-black text-green-700">₹{moneySaved}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-cyan-200 rounded-3xl p-6 text-center border-2 border-blue-300">
                <div className="text-5xl mb-2">🌍</div>
                <p className="text-gray-600 text-sm font-semibold mb-1">Pollution Avoided</p>
                <p className="text-3xl font-black text-blue-700">{pollutionAvoided}g</p>
              </div>
              <div className="bg-gradient-to-br from-purple-100 to-pink-200 rounded-3xl p-6 text-center border-2 border-purple-300">
                <div className="text-5xl mb-2">🚲</div>
                <p className="text-gray-600 text-sm font-semibold mb-1">Distance</p>
                <p className="text-3xl font-black text-purple-700">{distanceCovered} km</p>
              </div>
            </div>

            {/* Score */}
            <div className="bg-gradient-to-r from-yellow-100 to-amber-200 rounded-3xl p-8 mb-8 text-center border-2 border-yellow-400">
              <p className="text-gray-700 text-lg font-semibold mb-2">Final Score</p>
              <p className="text-7xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                {score}
              </p>
            </div>

            {/* Detailed Stats */}
            <div className="bg-gray-50 rounded-3xl p-6 mb-8 border-2 border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Your Journey</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">☀️ Solar collected:</span>
                  <span className="font-bold text-yellow-600">{analytics.solarPickups}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">🔋 Batteries grabbed:</span>
                  <span className="font-bold text-blue-600">{analytics.batteryPickups}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">🍃 Leaves picked:</span>
                  <span className="font-bold text-green-600">{analytics.leafPickups}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">💥 Obstacles hit:</span>
                  <span className="font-bold text-red-600">{analytics.obstacleHits}</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleExploreClick}
              className="font-fredoka w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 text-white text-3xl font-black py-8 px-8 rounded-3xl hover:from-emerald-600 hover:via-teal-600 hover:to-green-600 transition-all duration-300 shadow-2xl hover:shadow-emerald-500/50 transform hover:scale-105 active:scale-95 mb-4"
            >
              👉 Explore E-VIBE Quiz
            </button>

            {/* Secondary actions */}
            <div className="flex gap-4">
              <button
                onClick={startGame}
                className="flex-1 bg-gray-700 text-white text-lg font-bold py-4 px-6 rounded-2xl hover:bg-gray-800 transition-all duration-300"
              >
                🔄 Play Again
              </button>
              <button
                onClick={downloadAnalytics}
                className="flex-1 bg-blue-600 text-white text-lg font-bold py-4 px-6 rounded-2xl hover:bg-blue-700 transition-all duration-300"
              >
                📊 Download Stats
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default EVIBECommuteRun;
