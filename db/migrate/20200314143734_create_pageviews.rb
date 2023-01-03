class CreatePageviews < ActiveRecord::Migration[5.1]
  def change
    create_table :pageviews do |t|
      t.integer :count, default: 0
    end
  end
end
