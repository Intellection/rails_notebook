Rails.application.routes.draw do

  	get 'welcome/index'

  	Rails.application.routes.draw do
  		resources :articles do
  			resources :comments
  		end
  		resources :customers do
  			resources :invoices
  			resources :orders do
          resources :products
        end
  			resources :comments
  		end
  		root 'welcome#index'
	end

  mount RailsNotebook::Engine => "/rails_notebook"
end
