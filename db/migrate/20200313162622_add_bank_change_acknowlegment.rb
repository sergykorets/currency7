class AddBankChangeAcknowlegment < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :collection_acknowleged, :boolean, default: true
    add_column :users, :replenishment_acknowleged, :boolean, default: true
  end
end
