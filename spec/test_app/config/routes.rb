Rails.application.routes.draw do

  	get 'welcome/index'

  	Rails.application.routes.draw do
  		resources :articles do
  			resources :comments
  		end
  		root 'welcome#index'
	end

  mount RailsNotebook::Engine => "/rails_notebook"
end
