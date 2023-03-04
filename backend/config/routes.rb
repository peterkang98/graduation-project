Rails.application.routes.draw do
  devise_for :users,
  controllers:{
    sessions: 'users/sessions',
    registrations: 'users/registrations'
  }
  get '/member-data', to: 'members#show'
  post '/membership_countdown', to: 'members#count'
  post '/coupons', to: 'coupons#apply'
  get '/contents', to: 'contents#index'
  get '/contents/movie', to: 'contents#showMovie'
  get '/contents/tv', to: 'contents#showTv'
  get '/contents/:id', to: 'contents#show'
  get '/videos/*filepath', to: 'videos#stream' 
  get '/thumbnails/*filepath', to: 'thumbnails#makethumbnail'
  get '/home_cards/:id', to: 'home_cards#show'
  get '/home_cards', to: 'home_cards#index'
  get '/playlists/:id', to: 'playlists#show'
  get '/playlists', to: 'playlists#index'
  get '/episodes/:episode_id', to: 'episodes#show'
  get '/seasons/:id', to: 'seasons#show'
  get '/movies/:id', to: 'movies#show'
  get '/related/:id', to: 'related#show'
  post '/continue/:time', to: 'continue#save'
  get '/ratings', to: 'ratings#show'
  post '/ratings', to: 'ratings#rate'
  get '/continue', to: 'continue#show'
  get '/search/:title', to: 'search#show'
end
