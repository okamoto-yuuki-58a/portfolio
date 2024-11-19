class PlansController < ApplicationController
  before_action :require_login

  def index
    @q = current_user.plans.ransack(params[:q])
    @plans = @q.result(distinct: true).order(updated_at: :desc)
  end

  def new
    @plan = Plan.new
  end

  def create
    @plan = current_user.plans.build(plan_params)
    if @plan.save
      redirect_to plans_path, success: 'プランを作成しました'
    else
      flash.now[:danger] = 'プランの作成に失敗しました'
      render :new
    end
  end

  private

  def plan_params
    params.require(:plan).permit(:name, :prefecture, :start_date, :end_date)
  end
end