class CreateVisits < ActiveRecord::Migration[7.2]
  def change
    create_table :visits do |t|
      t.references :place, null: false, foreign_key: true
      # 外部キー制約は付けない（public.users を参照できないため）
      t.bigint :user_id, null: false

      t.datetime :visited_at
      t.integer :rating
      t.integer :price
      t.text :memo

      t.timestamps
    end

    # インデックスだけ張っておく（検索用）
    add_index :visits, :user_id
  end
end
