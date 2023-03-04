require "test_helper"

class ContentsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @content = contents(:one)
  end

  test "should get index" do
    get contents_url, as: :json
    assert_response :success
  end

  test "should create content" do
    assert_difference("Content.count") do
      post contents_url, params: { content: { average_rating: @content.average_rating, backdrop_path: @content.backdrop_path, content_id: @content.content_id, has_related_video: @content.has_related_video, is_a_movie: @content.is_a_movie, korean_title: @content.korean_title, maturity_rating: @content.maturity_rating, original_title: @content.original_title, overview: @content.overview, poster_path: @content.poster_path, rating_count: @content.rating_count, release_date: @content.release_date } }, as: :json
    end

    assert_response :created
  end

  test "should show content" do
    get content_url(@content), as: :json
    assert_response :success
  end

  test "should update content" do
    patch content_url(@content), params: { content: { average_rating: @content.average_rating, backdrop_path: @content.backdrop_path, content_id: @content.content_id, has_related_video: @content.has_related_video, is_a_movie: @content.is_a_movie, korean_title: @content.korean_title, maturity_rating: @content.maturity_rating, original_title: @content.original_title, overview: @content.overview, poster_path: @content.poster_path, rating_count: @content.rating_count, release_date: @content.release_date } }, as: :json
    assert_response :success
  end

  test "should destroy content" do
    assert_difference("Content.count", -1) do
      delete content_url(@content), as: :json
    end

    assert_response :no_content
  end
end
