class ReactivateController < ApplicationController

	def edit ; end

	def update
		user = User.find_by_email(params[:email])
		if user.nil?
			redirect_to :back, notice: 'User does not exist'
		elsif user.deleted_at.nil?
			redirect_to :back, notice: 'User has already activated his account'
		else
			user.update_attributes(deleted_at: nil)
			sign_in(user)
			redirect_to root_path, notice: 'Your account is successfully activated'
		end
	end
end