import React, { useState, useEffect, useMemo, memo, useCallback, useRef } from 'react';
import { 
  ComposableMap, 
  Geographies, 
  Geography, 
  ZoomableGroup,
  Sphere,
  Graticule,
  useMapContext
} from 'react-simple-maps';
import { geoCentroid } from 'd3-geo';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Map as MapIcon, 
  Trophy, 
  Compass, 
  Globe, 
  Flag, 
  Mountain, 
  CloudSun,
  Landmark,
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Info,
  BookOpen,
  SkipForward,
  Maximize,
  Minimize,
  CheckSquare,
  Play,
  Search,
  GripHorizontal
} from 'lucide-react';
import ReactConfetti from 'react-confetti';
import { feature } from 'topojson-client';
import { cn, shuffle } from './lib/utils';
import { MAP_SOURCES, QUESTIONS, MapScope, MapType, Question, RIVER_SOURCES, LAKE_SOURCES } from './data/maps';

const getGeoId = (geo: any) => {
  if (!geo) return "";
  const p = geo.properties || {};
  return (
    geo.id ||
    p.id ||
    p.ISO_A3 ||
    p.ST_NM ||
    p.district ||
    p.NAME_1 ||
    p.name ||
    p.name_en ||
    p.NAME ||
    p.Name ||
    p.name_alt ||
    geo.rsmKey ||
    ""
  );
};

const getGeoName = (geo: any, fallback = "Unknown Region") => {
  if (!geo) return fallback;
  const p = geo.properties || {};
  return (
    p.name ||
    p.NAME ||
    p.ST_NM ||
    p.district ||
    p.NAME_1 ||
    p.name_en ||
    p.NAME_EN ||
    p.Name ||
    p.name_alt ||
    fallback
  );
};

const RegionLabel = memo(({ geo, name, scope }: { geo: any, name: string, scope: string }) => {
  const { projection } = useMapContext();
  if (!projection) return null;

  const centroid = useMemo(() => {
    try {
      const c = geoCentroid(geo);
      if (c && !isNaN(c[0]) && !isNaN(c[1])) {
        return c;
      }
    } catch (e) {
      return null;
    }
    return null;
  }, [geo]);

  if (!centroid) return null;

  const projected = projection(centroid);
  if (!projected || isNaN(projected[0]) || isNaN(projected[1])) return null;

  const getFontSize = () => {
    switch (scope) {
      case 'india': return "6px";
      case 'odisha': return "2px";
      case 'world': return "10px";
      case 'europe': return "4px";
      default: return "6px";
    }
  };

  return (
    <text
      x={projected[0]}
      y={projected[1] + 2}
      textAnchor="middle"
      style={{
        fontFamily: "system-ui",
        fill: "#1A1A1A",
        fontSize: getFontSize(),
        pointerEvents: "none",
        fontWeight: "600",
        opacity: 0.8,
        textShadow: "1px 1px 0px rgba(255,255,255,0.8), -1px -1px 0px rgba(255,255,255,0.8), 1px -1px 0px rgba(255,255,255,0.8), -1px 1px 0px rgba(255,255,255,0.8)"
      }}
    >
      {name}
    </text>
  );
});

const MemoizedGeography = memo(({ 
  geo, 
  isSelected, 
  isHovered, 
  isDragging, 
  defaultFill, 
  strokeW, 
  colors, 
  onMouseEnter, 
  onMouseLeave, 
  onClick 
}: any) => {
  const style = useMemo(() => ({
    default: {
      fill: isSelected ? colors.selected : (isDragging && isHovered ? colors.hover : defaultFill),
      stroke: "#1A1A1A",
      strokeWidth: strokeW,
      outline: "none",
    },
    hover: {
      fill: colors.hover,
      stroke: "#1A1A1A",
      strokeWidth: strokeW * 1.5,
      outline: "none",
      cursor: "pointer",
    },
    pressed: {
      fill: colors.selected,
      stroke: "#1A1A1A",
      strokeWidth: strokeW * 1.5,
      outline: "none",
    },
  }), [isSelected, isHovered, isDragging, defaultFill, strokeW, colors]);

  return (
    <Geography
      geography={geo}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      style={style}
    />
  );
});

const MemoizedRiver = memo(({ geo, isSelected, onMouseEnter, onMouseLeave, onClick }: any) => (
  <Geography
    geography={geo}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    onClick={onClick}
    style={{
      default: { fill: "none", stroke: isSelected ? "#1A1A1A" : "#3498db", strokeWidth: isSelected ? 3 : 1.5, outline: "none" },
      hover: { fill: "none", stroke: "#2980b9", strokeWidth: 3, outline: "none", cursor: "pointer" },
      pressed: { fill: "none", stroke: "#1A1A1A", strokeWidth: 3, outline: "none" }
    }}
  />
));

const MemoizedLake = memo(({ geo, isSelected, onMouseEnter, onMouseLeave, onClick }: any) => (
  <Geography
    geography={geo}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    onClick={onClick}
    style={{
      default: { fill: isSelected ? "#1A1A1A" : "#a2d9ff", stroke: "#3498db", strokeWidth: 0.5, outline: "none" },
      hover: { fill: "#7fb3d5", stroke: "#3498db", strokeWidth: 1, outline: "none", cursor: "pointer" },
      pressed: { fill: "#1A1A1A", stroke: "#3498db", strokeWidth: 1, outline: "none" }
    }}
  />
));

const POLITICAL_COLORS = [
  "#FCA5A5", // red-300
  "#FCD34D", // amber-300
  "#86EFAC", // green-300
  "#93C5FD", // blue-300
  "#C4B5FD", // violet-300
  "#F9A8D4", // pink-300
  "#FDBA74", // orange-300
  "#6EE7B7", // emerald-300
  "#67E8F9", // cyan-300
  "#D8B4FE", // purple-300
];

const getPoliticalColor = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return POLITICAL_COLORS[Math.abs(hash) % POLITICAL_COLORS.length];
};

const GeographyList = memo(({ 
  geographies, 
  scope, 
  type, 
  gameStatus, 
  feedback, 
  selectedGeoId, 
  hoveredGeoId, 
  isDragging, 
  isMoving, 
  colors, 
  handleMouseEnter, 
  handleMouseLeave, 
  handleGeographyClick,
  getPoliticalColor
}: any) => {
  return (
    <>
      {geographies.map((geo: any) => {
        const geoId = getGeoId(geo);
        const geoName = getGeoName(geo);
        const isSelected = selectedGeoId === geoId;
        const isHovered = hoveredGeoId === geoId;
        
        const strokeW = scope === 'world' ? 0.5 : 1;
        const defaultFill = type === 'political' && scope !== 'world' 
           ? getPoliticalColor(geoName) 
           : colors.default;
        
        return (
          <g key={geo.rsmKey}>
            <MemoizedGeography
              geo={geo}
              isSelected={isSelected}
              isHovered={isHovered}
              isDragging={isDragging}
              defaultFill={defaultFill}
              strokeW={strokeW}
              colors={colors}
              onMouseEnter={() => handleMouseEnter(geoName, geoId, geo)}
              onMouseLeave={handleMouseLeave}
              onClick={(e: any) => handleGeographyClick(geo, e)}
            />
            {!isMoving && scope !== 'world' && (type === 'political' || type === 'physical') && (gameStatus !== 'playing' || (feedback && isSelected)) && (
              <RegionLabel geo={geo} name={geoName} scope={scope} />
            )}
          </g>
        );
      })}
    </>
  );
});

const RiverList = memo(({ 
  geographies, 
  scope, 
  gameStatus, 
  feedback, 
  selectedGeoId, 
  hoveredGeoName, 
  isMoving, 
  handleMouseEnter, 
  handleMouseLeave, 
  handleGeographyClick 
}: any) => {
  return (
    <>
      {geographies.map((geo: any) => {
        const name = getGeoName(geo, "River");
        const isSelected = selectedGeoId === name;
        return (
          <g key={geo.rsmKey}>
            <MemoizedRiver
              geo={geo}
              isSelected={isSelected}
              onMouseEnter={() => handleMouseEnter(name, name, geo)}
              onMouseLeave={handleMouseLeave}
              onClick={(e: any) => handleGeographyClick(geo, e)}
            />
            {!isMoving && (gameStatus !== 'playing' || (feedback && isSelected)) && (hoveredGeoName === name || isSelected) && (
              <RegionLabel geo={geo} name={name} scope={scope} />
            )}
          </g>
        );
      })}
    </>
  );
});

const LakeList = memo(({ 
  geographies, 
  scope, 
  gameStatus, 
  feedback, 
  selectedGeoId, 
  hoveredGeoName, 
  isMoving, 
  handleMouseEnter, 
  handleMouseLeave, 
  handleGeographyClick 
}: any) => {
  return (
    <>
      {geographies.map((geo: any) => {
        const name = getGeoName(geo, "Lake");
        const isSelected = selectedGeoId === name;
        return (
          <g key={geo.rsmKey}>
            <MemoizedLake
              geo={geo}
              isSelected={isSelected}
              onMouseEnter={() => handleMouseEnter(name, name, geo)}
              onMouseLeave={handleMouseLeave}
              onClick={(e: any) => handleGeographyClick(geo, e)}
            />
            {!isMoving && (gameStatus !== 'playing' || (feedback && isSelected)) && (hoveredGeoName === name || isSelected) && (
              <RegionLabel geo={geo} name={name} scope={scope} />
            )}
          </g>
        );
      })}
    </>
  );
});

type GameStatus = 'idle' | 'playing' | 'finished' | 'practice';

export default function App() {
  const [scope, setScope] = useState<MapScope>('world');
  const [type, setType] = useState<MapType>('political');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);
  const [feedbackPos, setFeedbackPos] = useState<{ x: number; y: number } | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const [practiceInfo, setPracticeInfo] = useState<{ name: string; id: string } | null>(null);
  const [gameMode, setGameMode] = useState<'click' | 'drag'>('click');
  const [selectedGeoId, setSelectedGeoId] = useState<string | null>(null);
  const [hoveredGeoName, setHoveredGeoName] = useState<string | null>(null);
  const [hoveredGeoId, setHoveredGeoId] = useState<string | null>(null);
  const [mapData, setMapData] = useState<any>(null);
  const [riverData, setRiverData] = useState<any>(null);
  const [lakeData, setLakeData] = useState<any>(null);
  const [dynamicQuestions, setDynamicQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [keepLabelsOnDrop, setKeepLabelsOnDrop] = useState(true);
  const [droppedLabels, setDroppedLabels] = useState<{ id: string, name: string, geo: any }[]>([]);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadMapData = async () => {
      setIsLoading(true);
      setDynamicQuestions([]);
      try {
        const response = await fetch(MAP_SOURCES[scope]);
        if (!response.ok) throw new Error(`Failed to fetch map data: ${response.statusText}`);
        const data = await response.json();
        
        if (isMounted) {
          let features: any[] = [];
          if (data.type === 'Topology') {
            const key = Object.keys(data.objects)[0];
            features = feature(data, data.objects[key] as any).features;
          } else if (data.type === 'FeatureCollection') {
            features = data.features;
          }

          // Filter features by continent if scope is a continent
          const continentMap: Record<string, string> = {
            'asia': 'Asia',
            'africa': 'Africa',
            'europe': 'Europe',
            'north-america': 'North America',
            'south-america': 'South America',
            'oceania': 'Oceania'
          };

          if (continentMap[scope]) {
            features = features.filter((f: any) => f.properties?.CONTINENT === continentMap[scope]);
            // Also update the mapData to only include these features so the map only renders the continent
            setMapData({ ...data, features });
          } else {
            setMapData(data);
          }

          const generatedQuestions = features.map((geo: any, index: number) => {
            const geoId = getGeoId(geo) || `geo-${index}`;
            const geoName = getGeoName(geo);

            return {
              id: `dyn-${geoId}-${index}`,
              text: `Locate ${geoName}`,
              targetId: geoId,
              targetName: geoName,
              category: 'political' as MapType
            };
          }).filter(q => q.targetName !== "Unknown Region" && q.targetName.trim() !== "");

          const shuffled = shuffle([...generatedQuestions]);
          setDynamicQuestions(shuffled);
          
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error loading map data:", error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadMapData();
    return () => { isMounted = false; };
  }, [scope]);

  useEffect(() => {
    let isMounted = true;
    const loadRiverData = async () => {
      if (type !== 'rivers') return;
      setIsLoading(true);
      setDynamicQuestions([]);
      try {
        const riverUrl = RIVER_SOURCES[scope];
        const lakeUrl = LAKE_SOURCES[scope];

        let allRiverFeatures: any[] = [];
        let allLakeFeatures: any[] = [];

        if (riverUrl) {
          const res = await fetch(riverUrl);
          const data = await res.json();
          if (isMounted && data && data.features) {
            if (scope === 'india' || scope === 'world' || scope === 'odisha') {
              allRiverFeatures = data.features.filter((f: any) => {
                const props = f.properties || {};
                const name = props.name || props.name_en || props.NAME || props.Name || props.name_alt || "";

                // Exclude major non-Indian rivers that might be in the global dataset
                const excluded = ["Mekong", "Salween", "Irrawaddy", "Yangtze", "Chindwin", "Sittaung", "Red River", "Pearl River", "Amur", "Lena", "Yenisei", "Ob", "Volga", "Danube", "Rhine", "Seine", "Thames", "Mississippi", "Missouri", "Amazon", "Nile", "Congo", "Zambezi", "Murray", "Darling", "Yukon", "Mackenzie", "St. Lawrence", "Rio Grande", "Orinoco", "Parana", "Niger", "Orange", "Limpopo", "Zambezi", "Okavango"];
                if (name && excluded.some(ex => name.includes(ex))) return false;

                // Bounding box for India region [68, 8, 97, 37]
                let inBBox = true;
                try {
                  const geometry = f.geometry;
                  if (geometry) {
                    let firstCoord: any = null;
                    if (geometry.type === "LineString") {
                      firstCoord = geometry.coordinates[0];
                    } else if (geometry.type === "MultiLineString") {
                      if (geometry.coordinates[0]) firstCoord = geometry.coordinates[0][0];
                    }
                    
                    if (Array.isArray(firstCoord)) {
                      const [lon, lat] = firstCoord;
                      // India roughly [68, 8, 97, 37]. Using [66, 6, 99, 39] for safety.
                      if (lon < 66 || lon > 99 || lat < 6 || lat > 39) inBBox = false;
                    }
                  }
                } catch (err) {
                  // Keep if check fails
                }
                
                return inBBox;
              });
              setRiverData({ type: "FeatureCollection", features: allRiverFeatures });
            } else {
              allRiverFeatures = data.features;
              setRiverData(data);
            }
          }
        }

        if (lakeUrl) {
          const res = await fetch(lakeUrl);
          const data = await res.json();
          if (isMounted && data && data.features) {
            if (scope === 'india' || scope === 'world' || scope === 'odisha') {
              allLakeFeatures = data.features.filter((f: any) => {
                const props = f.properties || {};
                const name = props.name || props.name_en || props.NAME || props.Name;

                // Bounding box for India lakes
                let inBBox = true;
                try {
                  const geometry = f.geometry;
                  if (geometry) {
                    let firstCoord: any = null;
                    if (geometry.type === "Polygon") {
                      if (geometry.coordinates[0]) firstCoord = geometry.coordinates[0][0];
                    } else if (geometry.type === "MultiPolygon") {
                      if (geometry.coordinates[0] && geometry.coordinates[0][0]) firstCoord = geometry.coordinates[0][0][0];
                    }
                    
                    if (Array.isArray(firstCoord)) {
                      const [lon, lat] = firstCoord;
                      // India roughly [68, 8, 97, 37]. Using [66, 6, 99, 39] for safety.
                      if (lon < 66 || lon > 99 || lat < 6 || lat > 39) inBBox = false;
                    }
                  }
                } catch (err) {
                  // Keep if check fails
                }

                return inBBox;
              });
              setLakeData({ type: "FeatureCollection", features: allLakeFeatures });
            } else {
              allLakeFeatures = data.features;
              setLakeData(data);
            }
          }
        }

        if (isMounted) {
          const riverQuestions = allRiverFeatures.map((geo: any, index: number) => {
            const geoId = getGeoId(geo);
            const geoName = getGeoName(geo, "Unknown River");
            return {
              id: `dyn-river-${geoId}-${index}`,
              text: `Locate the ${geoName}`,
              targetId: geoId,
              targetName: geoName,
              category: 'rivers' as MapType
            };
          });

          const lakeQuestions = allLakeFeatures.map((geo: any, index: number) => {
            const geoId = getGeoId(geo);
            const geoName = getGeoName(geo, "Unknown Lake");
            return {
              id: `dyn-lake-${geoId}-${index}`,
              text: `Locate ${geoName}`,
              targetId: geoId,
              targetName: geoName,
              category: 'rivers' as MapType
            };
          });

          const combined = [...riverQuestions, ...lakeQuestions]
            .filter(q => q.targetName !== "Unknown River" && q.targetName !== "Unknown Lake" && q.targetName.trim() !== "");
          
          const shuffled = shuffle(combined);
          setDynamicQuestions(shuffled);
          setIsLoading(false);
        }
      } catch (e) {
        console.error("Error loading river/lake data:", e);
        if (isMounted) setIsLoading(false);
      }
    };

    loadRiverData();
    return () => { isMounted = false; };
  }, [scope, type]);

  const currentQuestions = useMemo(() => {
    if (dynamicQuestions.length > 0) {
      return dynamicQuestions;
    }
    return QUESTIONS[scope].filter(q => q.category === type);
  }, [scope, type, dynamicQuestions]);

  const [isMoving, setIsMoving] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const handleMoveStart = useCallback(() => setIsMoving(true), []);
  const handleMoveEnd = useCallback(() => setIsMoving(false), []);

  const getMapColors = () => {
    switch (type) {
      case 'physical':
        return {
          bg: "#E8F5E9",
          default: "#A5D6A7",
          hover: "#81C784",
          selected: "#2E7D32"
        };
      case 'climatic':
        return {
          bg: "#FFF3E0",
          default: "#FFCC80",
          hover: "#FFB74D",
          selected: "#E65100"
        };
      case 'capitals':
        return {
          bg: "#F3E5F5",
          default: "#CE93D8",
          hover: "#BA68C8",
          selected: "#7B1FA2"
        };
      case 'rivers':
        return {
          bg: "#E3F2FD",
          default: "#BBDEFB",
          hover: "#90CAF9",
          selected: "#1976D2"
        };
      default:
        return {
          bg: "#FDFCF8",
          default: "#F5F5F0",
          hover: "#E6D5B8",
          selected: "#1A1A1A"
        };
    }
  };

  const getMapTransform = () => {
    switch (scope) {
      case 'india': return { center: [80, 22] as [number, number], zoom: 1 };
      case 'odisha': return { center: [84.5, 20.5] as [number, number], zoom: 1 };
      case 'asia': return { center: [90, 30] as [number, number], zoom: 2 };
      case 'africa': return { center: [20, 0] as [number, number], zoom: 2.5 };
      case 'europe': return { center: [20, 50] as [number, number], zoom: 3.5 };
      case 'north-america': return { center: [-100, 40] as [number, number], zoom: 2 };
      case 'south-america': return { center: [-60, -20] as [number, number], zoom: 2.5 };
      case 'oceania': return { center: [140, -20] as [number, number], zoom: 3 };
      default: return { center: [0, 0] as [number, number], zoom: 1 };
    }
  };

  const colors = useMemo(() => getMapColors(), [type]);
  const mapTransform = useMemo(() => getMapTransform(), [scope]);

  const currentQuestion = currentQuestions[currentQuestionIndex];

  const handleMouseEnter = useCallback((name: string, id: string, geo: any) => {
    setHoveredGeoName(name);
    setHoveredGeoId(id);
    (window as any)._hoveredGeo = geo;
    if (gameStatus === 'practice') {
      setPracticeInfo({ name, id });
    }
  }, [gameStatus]);

  const handleMouseLeave = useCallback(() => {
    setHoveredGeoName(null);
    setHoveredGeoId(null);
    (window as any)._hoveredGeo = null;
    if (gameStatus === 'practice') {
      setPracticeInfo(null);
    }
  }, [gameStatus]);

  const processAnswer = useCallback((geo: any) => {
    const geoId = getGeoId(geo);
    const geoName = getGeoName(geo);

    setSelectedGeoId(geoId);

    const normalize = (s: string) => s ? s.toLowerCase().replace(/ river| lake/g, '').trim() : "";
    const targetNorm = normalize(currentQuestion.targetName);
    const targetIdNorm = normalize(currentQuestion.targetId);
    
    const isCorrect = normalize(geoId) === targetIdNorm || 
                      normalize(geoId) === targetNorm ||
                      normalize(geoName || "") === targetNorm ||
                      normalize(geo.properties?.name_en || "") === targetNorm ||
                      normalize(geo.properties?.NAME_EN || "") === targetNorm;

    if (isCorrect) {
      setScore(s => s + 1);
      setFeedback({ correct: true, message: `Correct! That is ${geoName}.` });
      if (gameMode === 'drag' && keepLabelsOnDrop) {
        setDroppedLabels(prev => {
          // Prevent duplicates in manual drops
          if (prev.some(l => l.id === geoId)) return prev;
          return [...prev, { id: geoId, name: geoName, geo }];
        });
      }
    } else {
      setFeedback({ correct: false, message: `Incorrect. That is ${geoName}. Try to find ${currentQuestion.targetName}.` });
    }

    setTimeout(() => {
      setFeedback(null);
      setSelectedGeoId(null);
      if (isCorrect) {
        if (currentQuestionIndex < currentQuestions.length - 1) {
          setCurrentQuestionIndex(i => i + 1);
        } else {
          setGameStatus('finished');
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000);
        }
      }
    }, 2000);
  }, [currentQuestion, currentQuestionIndex, currentQuestions.length, gameMode, keepLabelsOnDrop]);

  const handleGeographyClick = useCallback((geo: any, e: React.MouseEvent) => {
    if (gameStatus !== 'playing' || feedback || gameMode === 'drag') return;
    setFeedbackPos({ x: e.clientX, y: e.clientY });
    processAnswer(geo);
  }, [gameStatus, feedback, gameMode, processAnswer]);

  const handleDragEnd = (geo: any) => {
    if (gameStatus !== 'playing' || feedback || !geo) return;
    processAnswer(geo);
  };

  const skipQuestion = () => {
    if (gameStatus !== 'playing' || feedback) return;
    
    // Highlight the correct answer
    setSelectedGeoId(currentQuestion.targetId);
    setFeedback({ 
      correct: false, 
      message: `Skipped. The correct answer was ${currentQuestion.targetName}.` 
    });

    setTimeout(() => {
      setFeedback(null);
      setSelectedGeoId(null);
      if (currentQuestionIndex < currentQuestions.length - 1) {
        setCurrentQuestionIndex(i => i + 1);
      } else {
        setGameStatus('finished');
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    }, 2500);
  };

  const submitQuiz = () => {
    if (gameStatus !== 'playing') return;

    // Create lookup maps for performance
    const riverMap = type === 'rivers' ? new Map(riverData?.features?.map((f: any) => [getGeoId(f), f])) : null;
    const lakeMap = type === 'rivers' ? new Map(lakeData?.features?.map((f: any) => [getGeoId(f), f])) : null;
    const mapFeatMap = type !== 'rivers' ? new Map(mapData?.features?.map((f: any) => [getGeoId(f), f])) : null;

    // Find all correct geographies for all questions in the current quiz
    const allLabels = currentQuestions.map(q => {
      let foundGeo = null;
      if (type === 'rivers') {
        foundGeo = riverMap?.get(q.targetId) || lakeMap?.get(q.targetId);
      } else {
        foundGeo = mapFeatMap?.get(q.targetId);
      }
      return { id: q.targetId, name: q.targetName, geo: foundGeo };
    }).filter(l => l.geo);

    // De-duplicate labels by ID to prevent React key warnings
    const uniqueLabels = Array.from(new Map(allLabels.map(item => [item.id, item])).values());

    setDroppedLabels(uniqueLabels);
    setGameStatus('finished');
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullScreen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const startPractice = () => {
    setGameStatus('practice');
    setScore(0);
    setFeedback(null);
    setSelectedGeoId(null);
    setDroppedLabels([]);
  };

  const exitPractice = () => {
    setGameStatus('idle');
    setPracticeInfo(null);
  };

  const startGame = () => {
    setScore(0);
    setCurrentQuestionIndex(0);
    setGameStatus('playing');
    setFeedback(null);
    setDroppedLabels([]);
  };

  const resetGame = () => {
    setGameStatus('idle');
    setScore(0);
    setCurrentQuestionIndex(0);
    setDroppedLabels([]);
  };

  return (
    <div className="h-screen flex flex-col bg-[#FDFCF8] text-[#1A1A1A] font-sans selection:bg-[#E6D5B8] overflow-hidden">
      {showConfetti && <ReactConfetti />}
      
      {/* Header */}
      <header className="border-b border-[#1A1A1A]/10 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1A1A1A] rounded-xl flex items-center justify-center text-white">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight uppercase">UPSC Map Master</h1>
              <p className="text-[10px] font-medium text-[#1A1A1A]/50 uppercase tracking-widest">Geography & Cartography</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {gameStatus === 'practice' && (
              <div className="flex items-center gap-4">
                <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-600 text-xs font-bold flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  PRACTICE MODE
                </div>
                <button
                  onClick={exitPractice}
                  className="px-4 py-2 bg-[#1A1A1A]/5 hover:bg-[#1A1A1A]/10 border border-[#1A1A1A]/10 rounded-full text-[#1A1A1A] text-xs font-bold transition-colors"
                >
                  EXIT
                </button>
              </div>
            )}
            <div className="flex items-center gap-2 bg-[#F5F5F0] px-4 py-2 rounded-full border border-[#1A1A1A]/5">
              <Trophy className="w-4 h-4 text-[#B8860B]" />
              <span className="text-sm font-bold">{score} / {currentQuestions.length}</span>
            </div>
            <button 
              onClick={resetGame}
              className="p-2 hover:bg-[#F5F5F0] rounded-full transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 lg:px-6 lg:py-6 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4 lg:gap-8 overflow-y-auto lg:overflow-hidden">
        {/* Sidebar Controls */}
        <aside className="space-y-6 lg:space-y-8 lg:overflow-y-auto lg:pr-4 pb-8">
          <section>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/40 mb-4">Activity Mode</h2>
            <div className="grid gap-2">
              <button
                onClick={startGame}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 text-left",
                  gameStatus === 'playing' 
                    ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" 
                    : "bg-white border-[#1A1A1A]/10 hover:border-[#1A1A1A]/30"
                )}
              >
                <Trophy className="w-4 h-4" />
                <span className="text-sm font-medium">Quiz Mode</span>
              </button>
              <button
                onClick={startPractice}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 text-left",
                  gameStatus === 'practice' 
                    ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" 
                    : "bg-white border-[#1A1A1A]/10 hover:border-[#1A1A1A]/30"
                )}
              >
                <Search className="w-4 h-4" />
                <span className="text-sm font-medium">Practice Mode</span>
              </button>
            </div>
          </section>

          <section>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/40 mb-4">Quiz Style</h2>
            <div className="flex flex-col gap-3">
              <div className="flex bg-white border border-[#1A1A1A]/10 rounded-xl p-1">
                <button
                  onClick={() => { setGameMode('click'); if (gameStatus !== 'practice') resetGame(); }}
                  className={cn(
                    "flex-1 py-2 text-xs font-bold rounded-lg transition-all",
                    gameMode === 'click' ? "bg-[#1A1A1A] text-white" : "text-[#1A1A1A]/60 hover:bg-[#F5F5F0]"
                  )}
                >
                  Point & Click
                </button>
                <button
                  onClick={() => { setGameMode('drag'); if (gameStatus !== 'practice') resetGame(); }}
                  className={cn(
                    "flex-1 py-2 text-xs font-bold rounded-lg transition-all",
                    gameMode === 'drag' ? "bg-[#1A1A1A] text-white" : "text-[#1A1A1A]/60 hover:bg-[#F5F5F0]"
                  )}
                >
                  Drag & Drop
                </button>
              </div>
              {gameMode === 'drag' && (
                <label className="flex items-center gap-2 px-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={keepLabelsOnDrop}
                    onChange={(e) => setKeepLabelsOnDrop(e.target.checked)}
                    className="w-4 h-4 accent-[#1A1A1A] rounded"
                  />
                  <span className="text-xs font-medium text-[#1A1A1A]/80">Keep labels on correct drop</span>
                </label>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/40 mb-4">Select Scope</h2>
            <div className="grid gap-2">
              {(['world', 'asia', 'africa', 'europe', 'north-america', 'south-america', 'oceania', 'india', 'odisha'] as MapScope[]).map((s) => (
                <button
                  key={s}
                  onClick={() => { 
                    setScope(s); 
                    if (gameStatus !== 'practice') {
                      resetGame(); 
                    } else {
                      setDroppedLabels([]);
                      setFeedback(null);
                      setSelectedGeoId(null);
                    }
                  }}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 text-left",
                    scope === s 
                      ? "bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-lg shadow-[#1A1A1A]/20" 
                      : "bg-white border-[#1A1A1A]/10 hover:border-[#1A1A1A]/30"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {s === 'world' && <Globe className="w-4 h-4" />}
                    {['asia', 'africa', 'europe', 'north-america', 'south-america', 'oceania'].includes(s) && <MapIcon className="w-4 h-4" />}
                    {s === 'india' && <Flag className="w-4 h-4" />}
                    {s === 'odisha' && <MapIcon className="w-4 h-4" />}
                    <span className="text-sm font-medium capitalize">{s.replace('-', ' ')}</span>
                  </div>
                  {scope === s && <ChevronRight className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/40 mb-4">Map Layer</h2>
            <div className="grid gap-2">
              {[
                { id: 'political', icon: Flag, label: 'Political' },
                { id: 'physical', icon: Mountain, label: 'Physical' },
                { id: 'climatic', icon: CloudSun, label: 'Climatic' },
                { id: 'capitals', icon: Landmark, label: 'Capitals' },
                { id: 'rivers', icon: Compass, label: 'Rivers' },
              ].map((l) => (
                <button
                  key={l.id}
                  onClick={() => { 
                    setType(l.id as MapType); 
                    if (gameStatus !== 'practice') {
                      resetGame(); 
                    } else {
                      setDroppedLabels([]);
                      setFeedback(null);
                      setSelectedGeoId(null);
                    }
                  }}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 text-left",
                    type === l.id 
                      ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" 
                      : "bg-white border-[#1A1A1A]/10 hover:border-[#1A1A1A]/30"
                  )}
                >
                  <l.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{l.label}</span>
                </button>
              ))}
            </div>
          </section>

          <div className="p-6 bg-[#E6D5B8]/20 rounded-2xl border border-[#E6D5B8] space-y-3">
            <div className="flex items-center gap-2 text-[#8B4513]">
              <Info className="w-4 h-4" />
              <span className="text-[11px] font-bold uppercase tracking-wider">UPSC Tip</span>
            </div>
            <p className="text-xs leading-relaxed text-[#5D4037]">
              Focus on neighboring countries, major mountain ranges, and climatic transitions. For Odisha, remember the coastal districts and river basins.
            </p>
          </div>
        </aside>

        {/* Map Area */}
        <div 
          ref={mapContainerRef}
          className={cn(
            "relative rounded-[32px] border border-[#1A1A1A]/10 shadow-2xl shadow-[#1A1A1A]/5 overflow-hidden flex flex-col transition-all duration-500",
            isFullScreen ? "fixed inset-0 z-[100] rounded-none border-none" : "h-[600px] lg:h-full"
          )}
          style={{ backgroundColor: colors.bg }}
        >
          {/* Full Screen Toggle */}
          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="absolute top-8 right-8 z-20 p-3 bg-white/80 backdrop-blur-md rounded-xl border border-[#1A1A1A]/10 shadow-lg hover:bg-white transition-all group"
            title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
          >
            {isFullScreen ? (
              <Minimize className="w-5 h-5 text-[#1A1A1A]" />
            ) : (
              <Maximize className="w-5 h-5 text-[#1A1A1A]" />
            )}
          </button>

          {/* Quiz Overlay */}
          <div className="absolute top-8 left-0 right-0 flex justify-center z-10 pointer-events-none">
            <div className="w-full max-w-sm px-4">
              <AnimatePresence mode="wait">
                {gameStatus === 'playing' && currentQuestion && (
                  <motion.div
                    drag
                    dragConstraints={mapContainerRef}
                    dragMomentum={false}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="bg-[#1A1A1A] text-white p-4 rounded-2xl shadow-2xl border border-white/10 text-center relative pointer-events-auto cursor-move"
                  >
                  <div className="flex items-center justify-between mb-3 opacity-40">
                    <GripHorizontal className="w-4 h-4" />
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em]">Q {currentQuestionIndex + 1} / {currentQuestions.length}</p>
                    <div className="w-4" /> {/* Spacer for symmetry */}
                  </div>
                  
                  {gameMode === 'click' ? (
                    <h3 className="text-lg font-medium leading-tight mb-1">{currentQuestion.text}</h3>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <p className="text-xs text-white/60">Drag label to location:</p>
                      <motion.div
                        drag
                        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                        dragElastic={1}
                        onDragStart={(e) => {
                          e.stopPropagation();
                          setIsDragging(true);
                        }}
                        onDragEnd={(event, info) => {
                          setIsDragging(false);
                          const hoveredGeo = (window as any)._hoveredGeo;
                          if (hoveredGeo) {
                            setFeedbackPos({ x: info.point.x, y: info.point.y });
                            handleDragEnd(hoveredGeo);
                          }
                        }}
                        whileDrag={{ scale: 1.1, zIndex: 100 }}
                        className={cn(
                          "px-4 py-2 bg-[#E6D5B8] text-[#1A1A1A] rounded-full font-bold shadow-xl cursor-grab active:cursor-grabbing border-2 border-white/20 transition-shadow text-sm",
                          isDragging && "pointer-events-none shadow-2xl"
                        )}
                        style={{ touchAction: 'none' }}
                      >
                        {currentQuestion.targetName}
                      </motion.div>
                    </div>
                  )}

                  {currentQuestion.hint && (
                    <p className="mt-1 text-[10px] text-white/40 italic">Hint: {currentQuestion.hint}</p>
                  )}

                  <div className="mt-4 flex items-center justify-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        skipQuestion();
                      }}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/10 group relative cursor-pointer"
                      title="Skip Question"
                    >
                      <SkipForward className="w-4 h-4" />
                      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-[#1A1A1A] text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">Skip</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        submitQuiz();
                      }}
                      className="p-2 bg-[#4CAF50] hover:bg-[#45a049] rounded-lg transition-colors border border-white/10 group relative cursor-pointer"
                      title="Submit Quiz"
                    >
                      <CheckSquare className="w-4 h-4" />
                      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-[#1A1A1A] text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">Submit</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {gameStatus === 'idle' && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-white p-8 rounded-3xl shadow-2xl border border-[#1A1A1A]/10 text-center space-y-6"
                >
                  <div className="w-16 h-16 bg-[#F5F5F0] rounded-full flex items-center justify-center mx-auto">
                    <BookOpen className="w-8 h-8 text-[#1A1A1A]" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold tracking-tight">UPSC Map Master</h3>
                    <p className="text-sm text-[#1A1A1A]/60">Explore the map by hovering over regions, or start a quiz to test your knowledge.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <button
                      onClick={startGame}
                      className="w-full py-4 bg-[#1A1A1A] text-white rounded-xl font-bold hover:bg-[#333] transition-colors shadow-lg shadow-[#1A1A1A]/20 flex items-center justify-center gap-2"
                    >
                      <Play className="w-5 h-5" />
                      Start Quiz
                    </button>
                    <button
                      onClick={startPractice}
                      className="w-full py-4 bg-white border border-[#1A1A1A]/10 text-[#1A1A1A] rounded-xl font-bold hover:bg-[#F5F5F0] transition-colors flex items-center justify-center gap-2"
                    >
                      <Search className="w-5 h-5" />
                      Practice Mode
                    </button>
                  </div>
                </motion.div>
              )}

              {gameStatus === 'finished' && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-white p-8 rounded-3xl shadow-2xl border border-[#1A1A1A]/10 text-center space-y-6"
                >
                  <div className="w-16 h-16 bg-[#FFD700]/20 rounded-full flex items-center justify-center mx-auto">
                    <Trophy className="w-8 h-8 text-[#B8860B]" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold tracking-tight">Quiz Complete!</h3>
                    <p className="text-sm text-[#1A1A1A]/60">You scored {score} out of {currentQuestions.length}.</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={startGame}
                      className="flex-1 py-4 bg-[#1A1A1A] text-white rounded-xl font-bold hover:bg-[#333] transition-colors"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={resetGame}
                      className="flex-1 py-4 bg-[#F5F5F0] text-[#1A1A1A] rounded-xl font-bold hover:bg-[#EAEAE0] transition-colors"
                    >
                      Back to Menu
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

          {/* Hover Tooltip (Study/Practice Mode) */}
          <AnimatePresence>
            {(gameStatus === 'idle' || gameStatus === 'practice') && hoveredGeoName && !isMoving && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 bg-[#1A1A1A]/90 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 shadow-2xl flex items-center gap-3 pointer-events-none"
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-white font-medium text-lg tracking-tight">{hoveredGeoName}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Feedback Toast */}
          <AnimatePresence>
            {feedback && feedbackPos && (
              <motion.div
                initial={{ y: 20, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 20, opacity: 0, scale: 0.9 }}
                className={cn(
                  "fixed z-50 px-6 py-4 rounded-2xl flex items-center gap-3 shadow-xl border -translate-x-1/2 -translate-y-full pointer-events-none",
                  feedback.correct 
                    ? "bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]" 
                    : "bg-[#FFEBEE] text-[#C62828] border-[#FFCDD2]"
                )}
                style={{
                  left: feedbackPos.x,
                  top: feedbackPos.y - 20, // slightly above the cursor
                }}
              >
                {feedback.correct ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                <span className="text-sm font-bold">{feedback.message}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Map Rendering */}
          <div className="flex-1 w-full h-full cursor-crosshair relative">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-40">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-[#1A1A1A] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A]/60">Loading {scope} Map...</p>
                </div>
              </div>
            ) : (
              <ComposableMap
                key={scope} // CRITICAL: Force re-render on scope change
                projection={['india', 'odisha'].includes(scope) ? "geoMercator" : "geoEqualEarth"}
                projectionConfig={
                  scope === 'india' 
                    ? { scale: 1000, center: [80, 22] } 
                    : scope === 'odisha'
                    ? { scale: 4500, center: [84.5, 20.5] }
                    : {}
                }
                style={{ width: "100%", height: "100%" }}
              >
                <ZoomableGroup 
                  center={mapTransform.center}
                  zoom={mapTransform.zoom}
                  onMoveStart={handleMoveStart}
                  onMoveEnd={handleMoveEnd}
                >
                  {!['india', 'odisha'].includes(scope) && (
                    <>
                      <Sphere stroke="#1A1A1A" strokeWidth={0.5} fill="transparent" id="sphere" />
                      <Graticule stroke="#1A1A1A" strokeWidth={0.5} opacity={0.1} />
                    </>
                  )}
                  <Geographies key={`${scope}-${type}`} geography={mapData}>
                    {({ geographies }) => (
                      <GeographyList 
                        geographies={geographies}
                        scope={scope}
                        type={type}
                        gameStatus={gameStatus}
                        feedback={feedback}
                        selectedGeoId={selectedGeoId}
                        hoveredGeoId={hoveredGeoId}
                        isDragging={isDragging}
                        isMoving={isMoving}
                        colors={colors}
                        handleMouseEnter={handleMouseEnter}
                        handleMouseLeave={handleMouseLeave}
                        handleGeographyClick={handleGeographyClick}
                        getPoliticalColor={getPoliticalColor}
                      />
                    )}
                  </Geographies>

                  {type === 'rivers' && riverData && (
                    <Geographies geography={riverData}>
                      {({ geographies }) => (
                        <RiverList 
                          geographies={geographies}
                          scope={scope}
                          gameStatus={gameStatus}
                          feedback={feedback}
                          selectedGeoId={selectedGeoId}
                          hoveredGeoName={hoveredGeoName}
                          isMoving={isMoving}
                          handleMouseEnter={handleMouseEnter}
                          handleMouseLeave={handleMouseLeave}
                          handleGeographyClick={handleGeographyClick}
                        />
                      )}
                    </Geographies>
                  )}

                  {type === 'rivers' && lakeData && (
                    <Geographies geography={lakeData}>
                      {({ geographies }) => (
                        <LakeList 
                          geographies={geographies}
                          scope={scope}
                          gameStatus={gameStatus}
                          feedback={feedback}
                          selectedGeoId={selectedGeoId}
                          hoveredGeoName={hoveredGeoName}
                          isMoving={isMoving}
                          handleMouseEnter={handleMouseEnter}
                          handleMouseLeave={handleMouseLeave}
                          handleGeographyClick={handleGeographyClick}
                        />
                      )}
                    </Geographies>
                  )}
                  {droppedLabels.map((label, idx) => (
                    <RegionLabel key={`dropped-${label.id}-${idx}`} geo={label.geo} name={label.name} scope={scope} />
                  ))}
                </ZoomableGroup>
              </ComposableMap>
            )}
          </div>

          {/* Legend / Footer */}
          <div className="p-6 border-t border-[#1A1A1A]/5 bg-white/30 backdrop-blur-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border border-[#1A1A1A]/20 rounded-sm" style={{ backgroundColor: colors.default }}></div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A]/40">
                  {type === 'political' ? 'Region' : type === 'physical' ? 'Terrain' : type === 'climatic' ? 'Climate Zone' : 'Capital City'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border border-[#1A1A1A]/20 rounded-sm" style={{ backgroundColor: colors.hover }}></div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A]/40">Focus</span>
              </div>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/30">
              UPSC Cartography Engine v1.0 • {type.toUpperCase()} MODE
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}


