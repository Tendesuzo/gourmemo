module Api
  module V1
    class VisitsController < ApplicationController
      # POST /api/v1/visits
      # { place_id, visited_at?, rating?, price?, memo? }
      def create
        visit = Visit.create!(
          place_id: visit_params[:place_id],
          user_id: 1, # MVP: 固定（認証導入後に置換）
          visited_at: visit_params[:visited_at] || Time.now,
          rating: visit_params[:rating],
          price: visit_params[:price],
          memo: visit_params[:memo]
        )
        render json: { id: visit.id }, status: :created
      end

      private

      def visit_params
        params.require(:visit).permit(:place_id, :visited_at, :rating, :price, :memo)
      end
    end
  end
end
