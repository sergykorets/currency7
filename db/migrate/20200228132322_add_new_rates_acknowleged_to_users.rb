class AddNewRatesAcknowlegedToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :new_rates_acknowleged, :boolean, default: true
  end
end
