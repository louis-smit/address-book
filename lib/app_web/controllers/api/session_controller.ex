defmodule AppWeb.API.SessionController do
  use AppWeb, :controller

  alias App.Guardian
  alias App.Accounts

  action_fallback AppWeb.FallbackController

  def create(conn, %{"user" => %{"email" => email, "password" => password}}) do
    case Accounts.get_user_by_email_and_password(email, password) do
      nil ->
        send_resp(conn, 401, "Invalid email or password")

      user ->
        {:ok, token, _claims} = Guardian.encode_and_sign(user)
        send_resp(conn, :ok, token)
    end
  end

  def refresh(conn, _params) do
    token = Guardian.Plug.current_token(conn)

    {:ok, _, {new_token, _new_claims}} = Guardian.refresh(token)

    send_resp(conn, :ok, new_token)
  end
end
