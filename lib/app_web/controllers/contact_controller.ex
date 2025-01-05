defmodule AppWeb.ContactController do
  use AppWeb, :controller

  alias App.Guardian
  alias App.AddressBook
  alias App.AddressBook.Contact

  action_fallback AppWeb.FallbackController

  def index(conn, _params) do
    user = Guardian.Plug.current_resource(conn)

    contacts = AddressBook.list_contacts_by_user(user)
    render(conn, :index, contacts: contacts)
  end

  def create(conn, %{"contact" => contact_params}) do
    user = Guardian.Plug.current_resource(conn)

    with {:ok, %Contact{} = contact} <- AddressBook.create_contact(user, contact_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", ~p"/api/contacts/#{contact}")
      |> render(:show, contact: contact)
    end
  end

  def show(conn, %{"id" => id}) do
    contact = AddressBook.get_contact!(id)
    render(conn, :show, contact: contact)
  end

  def update(conn, %{"id" => id, "contact" => contact_params}) do
    contact = AddressBook.get_contact!(id)

    with {:ok, %Contact{} = contact} <- AddressBook.update_contact(contact, contact_params) do
      render(conn, :show, contact: contact)
    end
  end

  def delete(conn, %{"id" => id}) do
    contact = AddressBook.get_contact!(id)

    with {:ok, %Contact{}} <- AddressBook.delete_contact(contact) do
      send_resp(conn, :no_content, "")
    end
  end
end
