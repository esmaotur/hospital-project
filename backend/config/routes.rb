Rails.application.routes.draw do
  post '/login', to: 'authentication#login'

  resources :users, only: [:create]

  resources :doctors, only: [:index] do
    collection do
      get 'available'
    end
  end

  resources :patients, only: [:show] do
    member do
      get 'appointments'
    end
  end

  resources :appointments, only: [:create]
end
