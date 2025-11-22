class CreatePatients < ActiveRecord::Migration[7.0]
  def change
    create_table :patients do |t|
      t.references :user, null: false, foreign_key: true
      t.string :name
      t.date :dob
      t.text :address

      t.timestamps
    end
  end
end
