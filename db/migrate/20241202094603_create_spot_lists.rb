class CreateSpotLists < ActiveRecord::Migration[7.0]
  def change
    create_table :spot_lists do |t|
      t.string :name, null: false
      t.string :address
      t.float :latitude
      t.float :longitude
      t.integer :position
      t.references :plan, null: false, foreign_key: true

      t.timestamps
    end
    add_index :spot_lists, [:plan_id, :position]
  end
end
