Rails.application.routes.draw do
  root 'currencies#index'
  mount ActionCable.server => '/cable'
  mount RailsAdmin::Engine => '/admin', as: 'rails_admin'
  devise_scope :user do
    # Redirests signing out users back to sign-in
    get "users", to: "devise/sessions#new"
  end
  devise_for :users, :controllers => { registrations: 'registrations',
                                       omniauth_callbacks: 'omniauth_callbacks' }
  resources :actions
  resources :versions, only: :index
  resources :transactions, only: :index do
    member do
      patch :cancel
    end
  end
  resources :currencies do
    member do
      post :cashdesk
    end
    collection do
      post :change_rates
      post :exchange
    end
  end
  get 'reactivate/edit', 'reactivate#edit'
  put 'reactivate/update', 'reactivate#update'
  patch 'users/submit_acknowledgment', 'users#submit_acknowledgment'
  #get 'bodia_kurs', to: 'pages#index'
end
