class CreatePublicPlaces < ActiveRecord::Migration[7.2]
  def change
    create_table :public_places do |t|
      t.string :name, null: false
      t.string :category
      t.string :address
      t.st_point :lonlat, geographic: true, null: false
      t.decimal :avg_rating, precision: 2, scale: 1
      t.integer :ratings_count
      t.timestamps
    end
    add_index :public_places, :lonlat, using: :gist
  end
end
