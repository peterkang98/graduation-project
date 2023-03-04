# playlist homecard data
# Playlist.create([{
# 	playlist_title: "심심할 땐? 팝콘 무비!",
# 	playlist_description: nil
# }])

# search = HomeCard.find(1)
# puts search["card_title"]

# tv_show_episode_search
# tv_shows = ["별에서 온 그대", "동백꽃 필 무렵", "쓸쓸하고 찬란하神-도깨비", "미생", "응답하라 1997", "치즈인더트랩", "이번 생은 처음이라"]

# seasons = TvShowSeason.where("season_id BETWEEN 73 AND 79").includes(:content)
# seasons.each do |season|
# 	query = CGI.escape(season.content.original_title.force_encoding('ASCII-8BIT'))
# 	url = "https://api.themoviedb.org/3/search/tv?api_key=859ad1be0fdb7692d2b1501018a362c7&page=1&language=ko-KR&query=#{query}&include_adult=false"
# 	result = JSON.parse(URI.open(url).read)
# 	(1..season.number_of_episodes).each do |episode|
# 		episode_url = "https://api.themoviedb.org/3/tv/#{result["results"][0]["id"]}/season/#{season.season_number}/episode/#{episode}?api_key=859ad1be0fdb7692d2b1501018a362c7&language=ko-KR"
# 		ep_result = JSON.parse(URI.open(episode_url).read)
# 		Episode.create([{
# 			season_id: season.season_id,
# 			episode_number: episode,
# 			episode_title: ep_result["name"],
# 			duration: ep_result["runtime"]==nil ? 59 : ep_result["runtime"],
# 			video_path: "/videos/#{season.content.content_id}/S#{season.season_number}/E#{episode}/"
# 		}])
# 	end
# end


# tv_show_season_search

# tv_shows = ["별에서 온 그대", "동백꽃 필 무렵", "쓸쓸하고 찬란하神-도깨비", "미생", "응답하라 1997", "치즈인더트랩", "이번 생은 처음이라"]
# i=73
# tv_shows.each do |title|
# 	search = Content.select(:content_id, :korean_title, :number_of_seasons, :poster_path).find_by original_title: title
# 	query = CGI.escape(title.force_encoding('ASCII-8BIT'))
# 	url = "https://api.themoviedb.org/3/search/tv?api_key=859ad1be0fdb7692d2b1501018a362c7&page=1&language=ko-KR&query=#{query}&include_adult=false"
# 	result = JSON.parse(URI.open(url).read)

# 	season_url = "https://api.themoviedb.org/3/tv/#{result["results"][0]["id"]}?api_key=859ad1be0fdb7692d2b1501018a362c7&language=ko-KR&append_to_response=episode_groups"
# 	season_result = JSON.parse(URI.open(season_url).read)
# 	season_result["seasons"].each do |season|
# 		next if season["season_number"] == 0

# 		poster = MiniMagick::Image.open("https://image.tmdb.org/t/p/original#{season["poster_path"]}")
# 		poster.resize "432x640!"
# 		poster.write(Rails.root.join('public').to_s + "/posters#{season["poster_path"]}")
# 		TvShowSeason.create([{
# 			season_id: i,
# 			content_id: search["content_id"],
# 			season_number: season["season_number"],
# 			number_of_episodes: season["episode_count"],
# 			season_full_title: search["korean_title"],
# 			season_type_name: "season",
# 			season_poster_path: search["poster_path"]
# 		}])
# 		i+=1
# 	end
# end

# tv_shows.each do |title|
# 	search = Content.select(:content_id, :korean_title, :number_of_seasons).find_by original_title: title
# 	query = CGI.escape(title.force_encoding('ASCII-8BIT'))
# 	url = "https://api.themoviedb.org/3/search/tv?api_key=859ad1be0fdb7692d2b1501018a362c7&page=1&language=ko-KR&query=#{query}&include_adult=false"
# 	result = JSON.parse(URI.open(url).read)

# 	season_url = "https://api.themoviedb.org/3/tv/#{result["results"][0]["id"]}?api_key=859ad1be0fdb7692d2b1501018a362c7&language=ko-KR&append_to_response=episode_groups"
# 	season_result = JSON.parse(URI.open(season_url).read)
# 	season_result["seasons"].each do |season|
# 		if season["season_number"] == 0
# 			poster = MiniMagick::Image.open("https://image.tmdb.org/t/p/original#{season["poster_path"]}")
# 			poster.resize "432x640!"
# 			poster.write(Rails.root.join('public').to_s + "/posters#{season["poster_path"]}")
# 			TvShowSeason.create([{
# 				content_id: search["content_id"],
# 				season_number: season["season_number"],
# 				number_of_episodes: season["episode_count"],
# 				season_full_title: "#{search["korean_title"]} #{season["name"]}",
# 				season_type_name: "special",
# 				season_poster_path: "/posters#{season["poster_path"]}"
# 			}])
# 		end
# 	end
# end


# tv_show_people_search
# tv_shows = ["Bohemian Rhapsody", "School of Rock", "We're the Millers", "Joker", "Venom", "Spider-Man: Homecoming"]
# i = 348
# tv_shows.each do |title|
# 	cast_num = 0
# 	crew_num = 0
# 	search = Content.select(:content_id).find_by original_title: title
# 	query = CGI.escape(title.force_encoding('ASCII-8BIT'))
# 	url = "https://api.themoviedb.org/3/search/movie?api_key=859ad1be0fdb7692d2b1501018a362c7&page=1&language=ko-KR&query=#{query}&include_adult=false"
# 	result = JSON.parse(URI.open(url).read)

# 	cast_url = "https://api.themoviedb.org/3/movie/#{result["results"][0]["id"]}/credits?api_key=859ad1be0fdb7692d2b1501018a362c7&language=ko-KR"
# 	cast_result = JSON.parse(URI.open(cast_url).read)
	# cast_result["cast"].each do |cast|
	# 	break if cast_num>=8

	# 	person = Person.where("name = ?", cast["name"]).first
	# 	p_id = i
	# 	p_poster =""
	# 	if person.blank?
	# 		begin
	# 			poster = MiniMagick::Image.open("https://image.tmdb.org/t/p/w185#{cast["profile_path"]}")
	# 			poster.write(Rails.root.join('public').to_s + "/profile#{cast["profile_path"]}")
	# 		rescue OpenURI::HTTPError
	# 			p_poster="/profile/cast_default.png"
	# 		end
	# 		Person.create([{
	# 			person_id: i,
	# 			name: cast["name"],
	# 			picture_path: p_poster=="" ? "/profile#{cast["profile_path"]}" : p_poster,
	# 			is_actor: true
	# 		}])
	# 	else
	# 		p_id = person.person_id
	# 	end
	# 	CastOrCrew.create([{
	# 		person_id: p_id,
	# 		content_id: search["content_id"],
	# 		role: "voiceactor",
	# 		character_name: cast["character"]
	# 	}])
	# 	i+=1
	# 	cast_num+=1
	# end
# 	crew_name=""
# 	cast_result["crew"].each do |crew|
# 		break if crew_num>=3
# 		next if crew["known_for_department"]!="Directing"
# 		next if crew["name"]==crew_name
# 		person = Person.where("name = ?", crew["name"]).first
# 		p_id = i
# 		if person.blank?
# 			Person.create([{
# 				person_id: i,
# 				name: crew["name"],
# 				picture_path: "/profile/cast_default.png",
# 				is_actor: false
# 			}])
# 			crew_name=crew["name"]
# 		else
# 			p_id=person.person_id
# 			crew_name=person.name
# 		end
# 		CastOrCrew.create([{
# 			person_id: p_id,
# 			content_id: search["content_id"],
# 			role: "director",
# 			character_name: nil
# 		}])
# 		i+=1
# 		crew_num+=1
# 	end
# end

# movie_people_search
# tv_shows = ["The Social Network"]
# cast_i = 51
# tv_shows.each do |title|
# 	search = Content.select(:content_id).find_by original_title: title
# 	query = CGI.escape(title.force_encoding('ASCII-8BIT'))
# 	url = "https://api.themoviedb.org/3/search/movie?api_key=859ad1be0fdb7692d2b1501018a362c7&page=1&language=ko-KR&query=#{query}&include_adult=false"
# 	result = JSON.parse(URI.open(url).read)

# 	cast_url = "https://api.themoviedb.org/3/movie/#{result["results"][0]["id"]}/credits?api_key=859ad1be0fdb7692d2b1501018a362c7&language=ko-KR"
# 	cast_result = JSON.parse(URI.open(cast_url).read)
# 	cast_result["cast"].each do |cast|
# 		break if cast_i == 61
# 		poster = MiniMagick::Image.open("https://image.tmdb.org/t/p/w185#{cast["profile_path"]}")
# 		poster.write(Rails.root.join('public').to_s + "/profile#{cast["profile_path"]}")
# 		Person.create([{
# 			person_id: cast_i,
# 			name: cast["name"],
# 			picture_path: cast["profile_path"],
# 			is_actor: true
# 		}])
# 		CastOrCrew.create([{
# 			person_id: cast_i,
# 			content_id: search["content_id"],
# 			role: "actor",
# 			character_name: cast["character"]
# 		}])
# 		cast_i+=1
# 	end
# 	cast_result["crew"].each do |crew|
# 		next if crew["known_for_department"]!="Directing"
# 		next if cast_i == 64
# 		pic_path = nil
# 		if crew["profile_path"] != nil
# 			poster = MiniMagick::Image.open("https://image.tmdb.org/t/p/w185#{crew["profile_path"]}")
# 			poster.write(Rails.root.join('public').to_s + "/profile#{crew["profile_path"]}")
# 			pic_path = crew["profile_path"]
# 		end

# 		Person.create([{
# 			person_id: cast_i,
# 			name: crew["name"],
# 			picture_path: pic_path,
# 			is_actor: false
# 		}])
# 		CastOrCrew.create([{
# 			person_id: cast_i,
# 			content_id: search["content_id"],
# 			role: "director",
# 			character_name: nil
# 		}])
# 		cast_i+=1
# 	end
# end


# movie runtime search and database insert
# movies = ["The Social Network", "Supersonic", "Inception", "千と千尋の神隠し", "기생충", "Bohemian Rhapsody", "ハウルの動く城", "君の名は", "天気の子", "School of Rock", "We're the Millers", "機動戦士ガンダム 閃光のハサウェイ", "Spider-Man: Into the Spider-Verse", "Joker", "Venom", "劇場版 呪術廻戦 0", "Spider-Man: Homecoming"]

# i = 0
# for id in 20..36 do
# 	query = CGI.escape(movies[i].force_encoding('ASCII-8BIT'))
# 	url = "https://api.themoviedb.org/3/search/movie?api_key=859ad1be0fdb7692d2b1501018a362c7&language=ko-KR&query=#{query}&page=1&include_adult=false"
# 	result = JSON.parse(URI.open(url).read)

# 	duration_url = "https://api.themoviedb.org/3/movie/#{result["results"][0]["id"]}?api_key=859ad1be0fdb7692d2b1501018a362c7"
# 	dur_result = JSON.parse(URI.open(duration_url).read)
# 	Dir.mkdir(Rails.root.join('videos').to_s+"#{id}")

# 	Movie.create([{
# 		movie_id: id,
# 		duration: dur_result["runtime"], 
# 		video_path: "/videos/#{id}/",
# 		}])

# 	i+=1	
# end


# movie search and database insert
# id_counter = 37
# search_list = ["기생충", "Bohemian Rhapsody", "ハウルの動く城"]

# search_list.each do |title|
# 	query = CGI.escape(title.force_encoding('ASCII-8BIT'))
# 	url = "https://api.themoviedb.org/3/search/movie?api_key=859ad1be0fdb7692d2b1501018a362c7&language=ko-KR&query=#{query}&page=1&include_adult=false"
# 	result = JSON.parse(URI.open(url).read)

# 	rating_url = "https://api.themoviedb.org/3/movie/#{result["results"][0]["id"]}/release_dates?api_key=859ad1be0fdb7692d2b1501018a362c7"
# 	rating_result = JSON.parse(URI.open(rating_url).read)

# 	content_rating = ""

# 	rating_result["results"].each do |i|
# 	    if i["iso_3166_1"] == "US"
# 	    	content_rating = i["release_dates"][0]["certification"]
# 	    	break
# 	    end
# 	end

# 	if content_rating == "G" or content_rating == "PG"
# 		content_rating = "ALL"
# 	elsif content_rating == "PG-13"
# 		content_rating = "12"
# 	elsif content_rating == "R"
# 		content_rating = "15"
# 	elsif content_rating == "NC-17"
# 		content_rating = "18"
# 	end


# 	backdrop = MiniMagick::Image.open("https://image.tmdb.org/t/p/original#{result["results"][0]["backdrop_path"]}")
# 	backdrop.resize "1500x844!"
# 	backdrop.write(Rails.root.join('public').to_s + "/backdrop#{result["results"][0]["backdrop_path"]}")

# 	poster = MiniMagick::Image.open("https://image.tmdb.org/t/p/original#{result["results"][0]["poster_path"]}")
# 	poster.resize "432x640!"
# 	poster.write(Rails.root.join('public').to_s + "/posters#{result["results"][0]["poster_path"]}")

# 	Content.create([{
# 		content_id: id_counter,
# 		original_title: result["results"][0]["original_title"], 
# 		korean_title: result["results"][0]["title"],
# 		overview: result["results"][0]["overview"],
# 		poster_path: "/posters#{result["results"][0]["poster_path"]}",
# 		backdrop_path: "/backdrop#{result["results"][0]["backdrop_path"]}",
# 		maturity_rating: content_rating,
# 		release_date: Date.parse(result["results"][0]["release_date"]),
# 		average_rating: (result["results"][0]["vote_average"]/2).floor(1),
# 		rating_count: 1,
# 		has_related_video: false,
# 		is_a_movie: true,
# 		number_of_seasons: nil
# 		}])
# 	id_counter+=1
# end