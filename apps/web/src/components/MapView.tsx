import { useEffect, useRef } from "react";
import maplibregl, { Map, Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

type Place = {
  id: number;
  name: string;
  category: string;
  lon: number;
  lat: number;
};

export default function MapView({ places }: { places: Place[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const markersRef = useRef<Marker[]>([]);

  useEffect(() => {
    if (!ref.current) return;
    if (mapRef.current) return;

    mapRef.current = new maplibregl.Map({
      container: ref.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [135.5, 34.7],
      zoom: 10,
    });
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

      // ピンを立てる
    places.forEach((p) => {
      const marker = new Marker({ color: "red" })
        .setLngLat([p.lon, p.lat])
        .setPopup(new maplibregl.Popup().setText(`${p.name} (${p.category})`))
        .addTo(map);
      markersRef.current.push(marker);
    });
  }, [places]);

//   return <div ref={ref} className="w-full h-[70vh] rounded-2xl shadow" />;
    return (
    <div
        ref={ref}
        className="w-full h-screen"
        style={{ minHeight: "800px" }} // 高さ確保
    />
    );

}


// import { useEffect, useRef } from "react";
// import maplibregl, { Map, Marker } from "maplibre-gl";
// import "maplibre-gl/dist/maplibre-gl.css";
// import { search } from "../lib/api";

// type PlaceResult = {
//   id: number;
//   name: string;
//   category?: string;
//   lon: number;
//   lat: number;
//   avg_rating?: number;
//   ratings_count?: number;
// };

// export default function MapView() {
//   const ref = useRef<HTMLDivElement>(null);
//   const mapRef = useRef<Map | null>(null);

//   useEffect(() => {
//     if (!ref.current) return;

//     // マップ初期化
//     const map = new maplibregl.Map({
//       container: ref.current,
//       style: "https://demotiles.maplibre.org/style.json",
//       center: [135.5, 34.7],
//       zoom: 10,
//     });
//     mapRef.current = map;

//     // マップロード時にAPI呼び出し
//     map.on("load", async () => {
//       try {
//         const base = import.meta.env.VITE_API_BASE || "http://localhost:3000";

//         // 現在の表示範囲から bbox を作成
//         const bounds = map.getBounds();
//         const bbox = `${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()}`;

//         // API呼び出し（privateモードで）
//         const res = await fetch(`${base}/api/v1/search?mode=private&bbox=${bbox}`);
//         const data = await res.json();

//         // ピンを立てる
//         (data as PlaceResult[]).forEach((p) => {
//           new Marker({ color: "red" })
//             .setLngLat([p.lon, p.lat])
//             .setPopup(new maplibregl.Popup().setText(`${p.name} (${p.category})`))
//             .addTo(map);
//         });
//       } catch (err) {
//         console.error("検索API呼び出し失敗:", err);
//       }
//     });

//     return () => map.remove();
//   }, []);

//   return <div ref={ref} className="w-full h-[70vh] rounded-2xl shadow" />;
// }
