require 'json'
require 'open-uri'
require 'cgi'
require 'mini_magick'

tv_shows = ["How I Met Your Mother"]

tv_shows.each do |title|
	query = CGI.escape(title.force_encoding('ASCII-8BIT'))
	url = "https://api.themoviedb.org/3/search/tv?api_key=859ad1be0fdb7692d2b1501018a362c7&page=1&language=ko-KR&query=#{query}&include_adult=false"
	result = JSON.parse(URI.open(url).read)

	season_url = "https://api.themoviedb.org/3/tv/#{result["results"][0]["id"]}?api_key=859ad1be0fdb7692d2b1501018a362c7&language=ko-KR&append_to_response=episode_groups"
	season_result = JSON.parse(URI.open(season_url).read)
	season_result["seasons"].each do |season|
		next if season["season_number"] == 0
		puts "#{season["season_number"]}, #{season["name"]}, #{season["episode_count"]}, #{season["poster_path"]}"
	end
end



# query = CGI.escape("기생충".force_encoding('ASCII-8BIT'))
# url = "https://api.themoviedb.org/3/search/movie?api_key=859ad1be0fdb7692d2b1501018a362c7&language=ko-KR&query=#{query}&page=1&include_adult=false"
# result = JSON.parse(URI.open(url).read)
# puts(result["results"][0]["vote_average"])
# puts((result["results"][0]["vote_average"]/2).floor(1))


# rating_url = "https://api.themoviedb.org/3/movie/#{result["results"][0]["id"]}/release_dates?api_key=859ad1be0fdb7692d2b1501018a362c7"
# rating_result = JSON.parse(URI.open(rating_url).read)

# content_rating = ""

# rating_result["results"].each do |i|
#     if i["iso_3166_1"] == "US"
#     	content_rating = i["release_dates"][0]["certification"]
#     	break
#     end
# end
# rating_result["results"].each do |j|
#     if j["iso_3166_1"] == "KR"
# 		content_rating = j["release_dates"][0]["certification"]
#     	break
#     end
# end


# backdrop = MiniMagick::Image.open("https://image.tmdb.org/t/p/original#{result["results"][0]["backdrop_path"]}")
# backdrop.resize "1500x844!"
# backdrop.write("C:/Users/Peter/Desktop/Rails_Project/ott_backend/public/backdrop#{result["results"][0]["backdrop_path"]}")

# poster = MiniMagick::Image.open("https://image.tmdb.org/t/p/original#{result["results"][0]["poster_path"]}")
# poster.resize "432x640!"
# poster.write("C:/Users/Peter/Desktop/Rails_Project/ott_backend/public/poster#{result["results"][0]["poster_path"]}")

