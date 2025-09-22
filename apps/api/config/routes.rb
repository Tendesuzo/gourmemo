Rails.application.routes.draw do
  get "/health", to: proc { [200, {}, ["ok"]] }
  get "up" => "rails/health#show", :as => :rails_health_check

  namespace :api do
    namespace :v1 do
      resources :places, only: [:index, :create, :show, :destroy]
      resources :visits, only: [:create]
      get "search", to: "search#index"
    end
  end
end
