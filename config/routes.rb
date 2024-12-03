Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
  root 'top_pages#home'

  get 'login', to: 'user_sessions#new', as: :login
  post 'login', to: 'user_sessions#create'
  delete 'logout', to: 'user_sessions#destroy', as: :logout
  
  get 'signup', to: 'users#new', as: :signup
  resources :users, only: [:create]

  resources :plans, only: [:new, :create, :index, :edit, :update]
end
