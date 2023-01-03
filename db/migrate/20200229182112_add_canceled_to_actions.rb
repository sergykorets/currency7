class AddCanceledToActions < ActiveRecord::Migration[5.1]
  def change
    add_column :actions, :canceled, :boolean, default: false
  end
end
