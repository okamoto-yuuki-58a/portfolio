class ApplicationController < ActionController::Base

  helper_method :ransack_params

  private

  def ransack_params
    params[:q] || {}
  end
end
