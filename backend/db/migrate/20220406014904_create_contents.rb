class CreateContents < ActiveRecord::Migration[7.0]
  def change
    create_table :contents, primary_key: :content_id do |t|
      t.string :original_title
      t.string :korean_title
      t.text :overview
      t.string :poster_path
      t.string :backdrop_path
      t.string :maturity_rating, limit: 4
      t.boolean :is_a_movie
      t.date :release_date
      t.decimal :average_rating, precision: 2, scale: 1
      t.integer :rating_count
      t.boolean :has_related_video

      t.timestamps
    end
  end
end
