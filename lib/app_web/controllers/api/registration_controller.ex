defmodule AppWeb.API.RegistrationController do
  use AppWeb, :controller

  alias App.Guardian
  alias App.Accounts

  action_fallback AppWeb.FallbackController

  def create(conn, %{"user" => user_params}) do
    with {:ok, user} <- Accounts.register_user(user_params) do
      {:ok, _} =
        Accounts.deliver_user_confirmation_instructions(
          user,
          &url(~p"/users/confirm/#{&1}")
        )

      {:ok, token, _claims} = Guardian.encode_and_sign(user)
      send_resp(conn, :ok, token)
    end
  end
end
