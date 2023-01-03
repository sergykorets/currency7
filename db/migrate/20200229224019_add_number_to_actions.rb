class AddNumberToActions < ActiveRecord::Migration[5.1]
  def change
    add_column :actions, :number, :integer
  end
end
