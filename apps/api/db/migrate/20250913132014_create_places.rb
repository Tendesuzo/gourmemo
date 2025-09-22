class CreatePlaces < ActiveRecord::Migration[7.2]
  def change
    create_table :places do |t|
      t.string :name, null: false
      t.string :category
      t.string :address
      # PostGIS: lonlat 列を geography(Point,4326) 型にする
      t.st_point :lonlat, geographic: true, null: false
      t.timestamps
    end
    add_index :places, :lonlat, using: :gist
  end
end
