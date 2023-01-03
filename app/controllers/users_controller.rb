class UsersController < ApplicationController
  before_action :authenticate_user!

  def submit_acknowledgment
    current_user.update("#{params[:user][:acknowledgment_type]}_acknowleged": true)
    if params[:user][:acknowledgment_type] == 'collection' || params[:user][:acknowledgment_type] == 'replenishment'
      redirect_to actions_path
    else
      redirect_to versions_path
    end
  end
end