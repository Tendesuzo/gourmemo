import { useState } from "react";
import { createPlace, createVisit } from "../lib/api";

type Props = {
  onAdded: () => void; // 追加後に再検索させる
  defaultLon?: number; // 省略時は関西あたり
  defaultLat?: number;
};

export default function AddPlaceForm({
  onAdded,
  defaultLon = 135.5,
  defaultLat = 34.7,
}: Props) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [lon, setLon] = useState(defaultLon);
  const [lat, setLat] = useState(defaultLat);
  const [status, setStatus] = useState<"none" | "visited" | "planned">("none");
  const [rating, setRating] = useState<number>(0);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    // 1) Place作成
    const place = await createPlace({ name, category, lon, lat });

    // 2) 「行った」を選んだら Visit も作成（★任意）
    if (status === "visited") {
      await createVisit({
        place_id: place.id,
        rating: rating > 0 ? rating : undefined,
      });
    }
    // planned は MVP では Place 登録のみ（Wishlist は次のステップで）

    // フォームリセット＆リロード
    setName("");
    setCategory("");
    setLon(defaultLon);
    setLat(defaultLat);
    setStatus("none");
    setRating(0);
    onAdded();
  };

  return (
    <form
      onSubmit={submit}
      className="space-y-2 border rounded p-3 bg-white shadow-sm"
    >
      <div className="font-bold text-text2">スポットを追加</div>

      <label className="block font-bold text-text2">
        店名
        <input
          className="w-full border rounded p-1 text-brand"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>

      <label className="block text-text2">
        カテゴリ（任意）
        <input
          className="w-full border rounded p-1 text-brand"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </label>

      <div className="grid grid-cols-2 gap-2">
        <label className="block text-text2">
          経度(lon)
          <input
            className="w-full border rounded p-1 text-brand"
            type="number"
            step="0.000001"
            value={lon}
            onChange={(e) => setLon(parseFloat(e.target.value))}
          />
        </label>
        <label className="block text-text2">
          緯度(lat)
          <input
            className="w-full border rounded p-1 text-brand"
            type="number"
            step="0.000001"
            value={lat}
            onChange={(e) => setLat(parseFloat(e.target.value))}
          />
        </label>
      </div>

      <label className="block text-text2">
        ステータス
        <select
          className="w-full border rounded p-1 text-brand"
          value={status}
          onChange={(e) =>
            setStatus(e.target.value as "none" | "visited" | "planned")
          }
        >
          <option value="none">未設定</option>
          <option value="visited">行った</option>
          <option value="planned">行きたい</option>
        </select>
      </label>

      {status === "visited" && (
        <label className="block text-text2">
          星（任意）
          <input
            type="range"
            min="0"
            max="5"
            step="0.5"
            value={rating}
            onChange={(e) => setRating(parseFloat(e.target.value))}
            className="w-full"
          />
          <div>★ {rating}</div>
        </label>
      )}

      <button
        type="submit"
        className="w-full py-2 rounded bg-blue-600 text-white"
      >
        追加
      </button>
    </form>
  );
}
