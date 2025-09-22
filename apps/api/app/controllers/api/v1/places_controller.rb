module Api
  module V1
    class PlacesController < ApplicationController
      # GET /api/v1/places?bbox=...   （簡易一覧）
      def index
        w, s, e, n = params[:bbox].to_s.split(",").map(&:to_f) if params[:bbox]
        places = Place.all
        if w && s && e && n
          places = places.where(
            "ST_Intersects(lonlat::geometry, ST_MakeEnvelope(?, ?, ?, ?, 4326))", w, s, e, n
          )
        end
        render json: places.limit(200).map { |p|
          {id: p.id, name: p.name, category: p.category,
           lon: p.lonlat.longitude, lat: p.lonlat.latitude}
        }
      end

      # POST /api/v1/places
      # { name, category?, address?, lon, lat }
      def create
        factory = RGeo::Geographic.spherical_factory(srid: 4326)
        point = factory.point(place_params[:lon].to_f, place_params[:lat].to_f)
        place = Place.create!(
          name: place_params[:name],
          category: place_params[:category],
          address: place_params[:address],
          lonlat: point
        )
        render json: {
          id: place.id, name: place.name, category: place.category,
          lon: place.lonlat.longitude, lat: place.lonlat.latitude
        }, status: :created
      end

      def destroy
        place = Place.find(params[:id])
        place.destroy!
        head :no_content
      end

      private

      def place_params
        params.require(:place).permit(:name, :category, :address, :lon, :lat)
      end
    end
  end
end
