class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable, :omniauthable,
         :recoverable, :rememberable, :trackable, :validatable

  enum role: [:admin, :cashier, :simple]

  def self.find_for_oauth(auth)
    user = User.where(uid: auth.uid, provider: auth.provider).first
    unless user
      user = User.create(
        uid:      auth.uid,
        provider: auth.provider,
        email:    auth.info.email,
        name:     auth.info.name,
        password: Devise.friendly_token[0, 20],
        remote_avatar_url: auth.info.image)
    end
    user
  end

  def self.new_with_session(params, session)
    super.tap do |user|
      if data = session["devise.facebook_data"] && session["devise.facebook_data"]["extra"]["raw_info"]
        user.email = data["email"] if user.email.blank?
      end
    end
  end

  def password_required?
    super && provider.blank?
  end

  def update_without_password(params, *options)
    if params[:password].blank?
      params.delete(:password)
      params.delete(:password_confirmation) if params[:password_confirmation].blank?
    end
    result = update_attributes(params, *options)
    clean_up_passwords
    result
  end

  def soft_delete
    update_attribute(:deleted_at, Time.current)
  end

  def has_acknowlegments?
    !(collection_acknowleged && replenishment_acknowleged && new_rates_acknowleged)
  end

  def acknowledgment_type
    if !collection_acknowleged
      'collection'
    elsif !replenishment_acknowleged
      'replenishment'
    else
      'new_rates'
    end
  end

end