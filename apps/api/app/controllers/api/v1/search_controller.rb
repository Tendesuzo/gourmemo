module Api
  module V1
    class SearchController < ApplicationController
      def index
        mode = (params[:mode] == "public") ? :public : :private
        w, s, e, n = params[:bbox].to_s.split(",").map(&:to_f) if params[:bbox]
        min_rating = params[:min_rating]&.to_f

        if mode == :private
          places = Place.all
          if w && s && e && n
            places = places.where(
              "ST_Intersects(lonlat::geometry, ST_MakeEnvelope(?, ?, ?, ?, 4326))",
              w, s, e, n
            )
          end
          if min_rating
            # places = places.joins(:visits).where("visits.rating >= ?", min_rating)
          end
          render json: places.limit(200).map { |p|
            {
              id: p.id,
              name: p.name,
              category: p.category,
              lon: p.lonlat.longitude,
              lat: p.lonlat.latitude
            }
          }
        else
          public_places = PublicPlace.all
          if w && s && e && n
            public_places = public_places.where(
              "ST_Intersects(lonlat::geometry, ST_MakeEnvelope(?, ?, ?, ?, 4326))",
              w, s, e, n
            )
          end
          if min_rating
            public_places = public_places.where("avg_rating >= ?", min_rating)
          end
          render json: public_places.limit(200).map { |p|
            {
              id: p.id,
              name: p.name,
              category: p.category,
              lon: p.lonlat.longitude,
              lat: p.lonlat.latitude,
              avg_rating: p.avg_rating,
              ratings_count: p.ratings_count
            }
          }
        end
      end
    end
  end
end

# module Api
#   module V1
#     class SearchController < ApplicationController
#       def index
#         render json: [{ id: 1, name: "テスト", lon: 135.5, lat: 34.7 }]
#       end
#     end
#   end
# end
