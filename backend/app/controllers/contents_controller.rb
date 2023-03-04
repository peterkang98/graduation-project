class ContentsController < ApplicationController
  before_action :set_content, only: %i[ show ]

  # GET /contents
  def index
    @contents = Content.all

    render json: @contents
  end

  # GET /contents/1
  def show
    render json: @content
  end

  def showMovie
    movies = Content.where('is_a_movie = ?', true)
    movies_list = []
    movies.each do |movie|
      movies_list<<movie.as_json.merge!({:categories =>movie.categories}.as_json)
    end
    render json: {:contents => movies_list}

  end

  def showTv
    tv = Content.where('is_a_movie = ?', false)
    tv_list = []
    tv.each do |content|
      tv_list<<content.as_json.merge!({:categories =>content.categories}.as_json)
    end
    render json: {:contents => tv_list}
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_content
      @content = Content.find(params[:id])
      people = @content.people.includes(:cast_or_crews).order("person_id ASC")
      cast = []
      people.each do |person|
        cast << CastOrCrew.where("person_id = ?", person.person_id).first.as_json.merge!(person.as_json)
      end
      categories = @content.categories

      @content = @content.as_json.merge!({:people => cast, :categories => categories}.as_json)
    end  
end
