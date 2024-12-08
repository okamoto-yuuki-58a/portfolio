class SpotListsController < ApplicationController
  before_action :require_login
  before_action :set_plan

  def index
    @spot_lists = @plan.spot_lists
    render json: @spot_lists
  end

  private

  def set_plan
    @plan = current_user.plans.find(params[:plan_id])
  end
end