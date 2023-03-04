class CreatePeople < ActiveRecord::Migration[7.0]
  def change
    create_table :people, primary_key: :person_id do |t|
      t.string :name, limit: 50, null: false
      t.string :picture_path
      t.boolean :is_actor, null: false
    end
  end
end
