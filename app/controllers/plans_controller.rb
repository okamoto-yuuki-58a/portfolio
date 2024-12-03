class PlansController < ApplicationController
  before_action :require_login
  before_action :set_plan, only: [:edit, :update]

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

  def edit
    @spots = @plan.spot_lists
  end

  def update
    if @plan.update(plan_params)
      redirect_to @plan, notice: 'プランが更新されました。'
    else
      render :edit
    end
  end

  private

  def set_plan
    @plan = current_user.plans.find(params[:id])
  end

  def plan_params
    params.require(:plan).permit(:name, :prefecture, :start_date, :end_date,
                                 spot_lists_attributes: [:id, :name, :address, :latitude, :longitude, :position, :_destroy])
  end
end