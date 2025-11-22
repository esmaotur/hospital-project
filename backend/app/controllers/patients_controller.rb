class PatientsController < ApplicationController
  before_action :authorize_request

  # GET /patients/:id
  def show
    @patient = Patient.find(params[:id])
    render json: @patient
  end

  # GET /patients/:id/appointments
  def appointments
    @patient = Patient.find(params[:id])
    render json: @patient.appointments
  end
end
