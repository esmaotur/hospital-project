class DoctorsController < ApplicationController
  before_action :authorize_request

  # GET /doctors
  def index
    @doctors = Doctor.all
    render json: @doctors
  end

  # GET /doctors/available
  def available
    # Example logic: Find doctors who have no appointments today or specific logic
    # For simplicity, returning all doctors as 'available' or filtering by a status if added
    @doctors = Doctor.all # Implement availability logic as needed
    render json: @doctors
  end
end
