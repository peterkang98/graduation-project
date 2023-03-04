class CreateCastOrCrews < ActiveRecord::Migration[7.0]
  def change
    create_table :cast_or_crews, id: false do |t|
      t.bigint :person_id, null:false
      t.bigint :content_id, null:false
      t.string :role, limit: 10, null:false
      t.string :character_name, limit: 50
    end

    add_foreign_key :cast_or_crews, :people, column: 'person_id', primary_key: 'person_id'
    add_foreign_key :cast_or_crews, :contents, column: 'content_id', primary_key: 'content_id'
    add_index :cast_or_crews, :person_id
    add_index :cast_or_crews, :content_id
  end
end
