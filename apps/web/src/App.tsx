import AddPlaceForm from "./components/AddPlaceForm";
import MapView from "./components/MapView";
import { search } from "./lib/api";
import { useState, useEffect } from "react";

type Status = "visited" | "planned" | "all";

type Place = {
  id: number;
  name: string;
  category: string;
  lon: number;
  lat: number;
  avg_rating?: number;
};

function App() {
  const [mode, setMode] = useState<"private" | "public">("private");
  const [status, setStatus] = useState<"visited" | "planned" | "all">("all");
  const [minRating, setMinRating] = useState<number>(0);
  const [places, setPlaces] = useState<Place[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const bounds = { west: 135.3, south: 34.6, east: 135.8, north: 34.9 };
        const bbox = `${bounds.west},${bounds.south},${bounds.east},${bounds.north}`;
        const data = await search({
          mode,
          bbox,
          status,
          min_rating: minRating,
        });
        if (Array.isArray(data)) {
          setPlaces(data);
        } else {
          console.error("API error:", data);
          setPlaces([]); // エラー時は空配列
        }
      } catch (err) {
        console.error("fetch failed:", err);
        setPlaces([]);
      }
    };
    load();
  }, [mode, status, minRating]);

  const reload = async () => {
    // 実際は map の現在BBOXを使うのが◎（ここでは仮の範囲）
    const bounds = { west: 135.3, south: 34.6, east: 135.8, north: 34.9 };
    const bbox = `${bounds.west},${bounds.south},${bounds.east},${bounds.north}`;
    const data = await search({ mode, bbox, status, min_rating: minRating });
    setPlaces(data);
  };

  useEffect(() => {
    reload();
  }, [mode, status, minRating]); // 依存変数で再検索

  return (
    <div className="flex">
      {/* 左サイドバー */}
      <div className="w-80 p-4 space-y-4 border-r bg-brandLight">
        <h1 className="text-xl font-bold text-text">Gourmemo</h1>

        {/* モード切替 */}
        <div className="flex gap-2">
          <button
            onClick={() => setMode("private")}
            className={`px-3 py-1 rounded ${
              mode === "private" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            自分用
          </button>
          <button
            onClick={() => setMode("public")}
            className={`px-3 py-1 rounded ${
              mode === "public" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            公開
          </button>
        </div>

        {/* 行った／行きたい */}
        {mode === "private" && (
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Status)}
            className="w-full border rounded p-1"
          >
            <option value="all">すべて</option>
            <option value="visited">行った</option>
            <option value="planned">行きたい</option>
          </select>
        )}

        {/* 星フィルタ */}
        <label className="block">
          星 {minRating} 以上
          <input
            type="range"
            min="0"
            max="5"
            step="0.5"
            value={minRating}
            onChange={(e) => setMinRating(parseFloat(e.target.value))}
            className="w-full"
          />
        </label>

        {mode === "private" && <AddPlaceForm onAdded={reload} />}

        {/* 検索結果リスト */}
        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
          {places.map((p) => (
            <div key={p.id} className="border rounded p-2 bg-white shadow-sm">
              <div className="font-bold">{p.name}</div>
              <div className="text-sm text-gray-500">{p.category}</div>
              {p.avg_rating && (
                <div className="text-yellow-600">★ {p.avg_rating}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 右メイン: Map */}
      <div className="flex-1">
        <MapView places={places} />
      </div>
    </div>
  );
}

export default App;
