class CreateCategories < ActiveRecord::Migration[7.0]
  def change
    create_table :categories, id: false, primary_key: :category_id do |t|
      t.primary_key :category_id, :integer
      t.string :category_name, null:false
      t.string :category_type, limit: 30, null:false
    end

    create_table :content_categories, id: false do |t|
      t.integer :category_id, null:false
      t.bigint :content_id, null:false
    end

    add_foreign_key :content_categories, :contents, column: 'content_id', primary_key: 'content_id', on_delete: :cascade
    add_foreign_key :content_categories, :categories, column: 'category_id', primary_key: 'category_id', on_delete: :cascade
  end
end
