defmodule AppWeb.ContactControllerTest do
  use AppWeb.ConnCase

  import App.AddressBookFixtures

  alias App.AddressBook.Contact

  @create_attrs %{
    first: "some first",
    last: "some last",
    avatar: "some avatar",
    twitter: "some twitter",
    notes: "some notes",
    favorite: true
  }
  @update_attrs %{
    first: "some updated first",
    last: "some updated last",
    avatar: "some updated avatar",
    twitter: "some updated twitter",
    notes: "some updated notes",
    favorite: false
  }
  @invalid_attrs %{first: nil, last: nil, avatar: nil, twitter: nil, notes: nil, favorite: nil}

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all contacts", %{conn: conn} do
      conn = get(conn, ~p"/api/contacts")
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create contact" do
    test "renders contact when data is valid", %{conn: conn} do
      conn = post(conn, ~p"/api/contacts", contact: @create_attrs)
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, ~p"/api/contacts/#{id}")

      assert %{
               "id" => ^id,
               "avatar" => "some avatar",
               "favorite" => true,
               "first" => "some first",
               "last" => "some last",
               "notes" => "some notes",
               "twitter" => "some twitter"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, ~p"/api/contacts", contact: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update contact" do
    setup [:create_contact]

    test "renders contact when data is valid", %{conn: conn, contact: %Contact{id: id} = contact} do
      conn = put(conn, ~p"/api/contacts/#{contact}", contact: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, ~p"/api/contacts/#{id}")

      assert %{
               "id" => ^id,
               "avatar" => "some updated avatar",
               "favorite" => false,
               "first" => "some updated first",
               "last" => "some updated last",
               "notes" => "some updated notes",
               "twitter" => "some updated twitter"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, contact: contact} do
      conn = put(conn, ~p"/api/contacts/#{contact}", contact: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete contact" do
    setup [:create_contact]

    test "deletes chosen contact", %{conn: conn, contact: contact} do
      conn = delete(conn, ~p"/api/contacts/#{contact}")
      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, ~p"/api/contacts/#{contact}")
      end
    end
  end

  defp create_contact(_) do
    contact = contact_fixture()
    %{contact: contact}
  end
end
