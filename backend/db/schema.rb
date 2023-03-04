# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2022_11_20_085424) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "cast_or_crews", primary_key: ["person_id", "content_id"], force: :cascade do |t|
    t.bigint "person_id", null: false
    t.bigint "content_id", null: false
    t.string "role", limit: 10, null: false
    t.string "character_name", limit: 50
    t.index ["content_id"], name: "index_cast_or_crews_on_content_id"
    t.index ["person_id"], name: "index_cast_or_crews_on_person_id"
  end

  create_table "categories", primary_key: "category_id", id: :serial, force: :cascade do |t|
    t.string "category_name", null: false
    t.string "category_type", limit: 30, null: false
  end

  create_table "content_categories", primary_key: ["category_id", "content_id"], force: :cascade do |t|
    t.integer "category_id", null: false
    t.bigint "content_id", null: false
  end

  create_table "contents", primary_key: "content_id", force: :cascade do |t|
    t.string "original_title", null: false
    t.string "korean_title", null: false
    t.text "overview", null: false
    t.string "poster_path", null: false
    t.string "backdrop_path", null: false
    t.string "maturity_rating", limit: 4, null: false
    t.date "release_date", null: false
    t.decimal "average_rating", precision: 2, scale: 1, null: false
    t.integer "rating_count", null: false
    t.boolean "has_related_video", null: false
    t.boolean "is_a_movie", null: false
    t.integer "number_of_seasons", limit: 2
    t.integer "duration_or_episodes", limit: 2
    t.index ["korean_title"], name: "index_contents_on_korean_title"
    t.index ["original_title"], name: "index_contents_on_original_title"
  end

  create_table "continue_watchings", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "episode_id"
    t.bigint "movie_id"
    t.decimal "resume_time", precision: 6, scale: 3, null: false
    t.datetime "updated", precision: nil
    t.index ["user_id"], name: "index_continue_watchings_on_user_id"
  end

  create_table "coupon_usages", primary_key: ["user_id", "coupon_code"], force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "coupon_code", null: false
  end

  create_table "coupons", primary_key: "coupon_code", id: { type: :string, limit: 20 }, force: :cascade do |t|
    t.integer "coupon_time", null: false
  end

  create_table "episodes", primary_key: "episode_id", force: :cascade do |t|
    t.bigint "season_id", null: false
    t.integer "episode_number", limit: 2, null: false
    t.string "episode_title"
    t.integer "duration", limit: 2, null: false
    t.string "video_path", null: false
    t.index ["season_id"], name: "index_episodes_on_season_id"
  end

  create_table "home_cards", primary_key: "card_id", id: :serial, force: :cascade do |t|
    t.bigint "content_id"
    t.integer "playlist_id"
    t.string "card_title", limit: 50, null: false
    t.string "card_subtitle", limit: 50
    t.string "card_description", null: false
    t.string "card_image_path", null: false
    t.index ["content_id"], name: "content_uniqueness", unique: true
    t.index ["content_id"], name: "index_home_cards_on_content_id"
    t.index ["playlist_id"], name: "index_home_cards_on_playlist_id"
    t.index ["playlist_id"], name: "playlist_uniqueness", unique: true
  end

  create_table "jwt_denylist", force: :cascade do |t|
    t.string "jti", null: false
    t.datetime "exp", null: false
    t.index ["jti"], name: "index_jwt_denylist_on_jti"
  end

  create_table "movies", primary_key: "movie_id", force: :cascade do |t|
    t.integer "duration", limit: 2
    t.string "video_path"
    t.index ["movie_id"], name: "pk_fk", unique: true
  end

  create_table "people", primary_key: "person_id", force: :cascade do |t|
    t.string "name", limit: 50, null: false
    t.string "picture_path"
    t.boolean "is_actor", null: false
  end

  create_table "playlist_contents", primary_key: ["playlist_id", "content_id"], force: :cascade do |t|
    t.integer "playlist_id", null: false
    t.bigint "content_id", null: false
    t.index ["content_id"], name: "index_playlist_contents_on_content_id"
    t.index ["playlist_id"], name: "index_playlist_contents_on_playlist_id"
  end

  create_table "playlists", primary_key: "playlist_id", id: :serial, force: :cascade do |t|
    t.string "playlist_title", limit: 50, null: false
    t.text "playlist_description"
  end

  create_table "subtitles", force: :cascade do |t|
    t.bigint "episode_id"
    t.bigint "movie_id"
    t.string "language", limit: 3, null: false
    t.string "subtitle_path", null: false
  end

  create_table "timestamps", force: :cascade do |t|
    t.bigint "episode_id"
    t.bigint "movie_id"
    t.decimal "start_time", precision: 6, scale: 3, null: false
    t.decimal "end_time", precision: 6, scale: 3
    t.string "ts_type", limit: 10, null: false
  end

  create_table "tv_show_seasons", primary_key: "season_id", force: :cascade do |t|
    t.bigint "content_id", null: false
    t.integer "season_number", limit: 2, null: false
    t.integer "number_of_episodes", limit: 2, null: false
    t.string "season_full_title"
    t.string "season_type_name", limit: 10
    t.string "season_poster_path"
    t.index ["content_id"], name: "index_tv_show_seasons_on_content_id"
  end

  create_table "user_ratings", primary_key: ["user_id", "content_id"], force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "content_id", null: false
    t.decimal "rating", precision: 2, scale: 1, null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.date "birthday"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "username", limit: 30
    t.decimal "membership_time_left", precision: 9, scale: 3
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  create_table "watched_contents", primary_key: ["user_id", "content_id"], force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "content_id", null: false
  end

  add_foreign_key "cast_or_crews", "contents", primary_key: "content_id"
  add_foreign_key "cast_or_crews", "people", primary_key: "person_id"
  add_foreign_key "content_categories", "categories", primary_key: "category_id", on_delete: :cascade
  add_foreign_key "content_categories", "contents", primary_key: "content_id", on_delete: :cascade
  add_foreign_key "continue_watchings", "episodes", primary_key: "episode_id"
  add_foreign_key "continue_watchings", "movies", primary_key: "movie_id"
  add_foreign_key "continue_watchings", "users"
  add_foreign_key "coupon_usages", "coupons", column: "coupon_code", primary_key: "coupon_code", on_delete: :cascade
  add_foreign_key "coupon_usages", "users", on_delete: :cascade
  add_foreign_key "episodes", "tv_show_seasons", column: "season_id", primary_key: "season_id", on_delete: :cascade
  add_foreign_key "home_cards", "contents", primary_key: "content_id", on_delete: :cascade
  add_foreign_key "home_cards", "playlists", primary_key: "playlist_id", on_delete: :cascade
  add_foreign_key "movies", "contents", column: "movie_id", primary_key: "content_id", on_delete: :cascade
  add_foreign_key "playlist_contents", "contents", primary_key: "content_id", on_delete: :cascade
  add_foreign_key "playlist_contents", "playlists", primary_key: "playlist_id", on_delete: :cascade
  add_foreign_key "subtitles", "episodes", primary_key: "episode_id"
  add_foreign_key "subtitles", "movies", primary_key: "movie_id"
  add_foreign_key "timestamps", "episodes", primary_key: "episode_id"
  add_foreign_key "timestamps", "movies", primary_key: "movie_id"
  add_foreign_key "tv_show_seasons", "contents", primary_key: "content_id", on_delete: :cascade
  add_foreign_key "user_ratings", "contents", primary_key: "content_id", on_delete: :cascade
  add_foreign_key "user_ratings", "users", on_delete: :cascade
  add_foreign_key "watched_contents", "contents", primary_key: "content_id", on_delete: :cascade
  add_foreign_key "watched_contents", "users", on_delete: :cascade
end
