defmodule App.AddressBookTest do
  use App.DataCase

  alias App.AddressBook

  describe "contacts" do
    alias App.AddressBook.Contact

    import App.AddressBookFixtures

    @invalid_attrs %{first: nil, last: nil, avatar: nil, twitter: nil, notes: nil, favorite: nil}

    test "list_contacts/0 returns all contacts" do
      contact = contact_fixture()
      assert AddressBook.list_contacts() == [contact]
    end

    test "get_contact!/1 returns the contact with given id" do
      contact = contact_fixture()
      assert AddressBook.get_contact!(contact.id) == contact
    end

    test "create_contact/1 with valid data creates a contact" do
      valid_attrs = %{first: "some first", last: "some last", avatar: "some avatar", twitter: "some twitter", notes: "some notes", favorite: true}

      assert {:ok, %Contact{} = contact} = AddressBook.create_contact(valid_attrs)
      assert contact.first == "some first"
      assert contact.last == "some last"
      assert contact.avatar == "some avatar"
      assert contact.twitter == "some twitter"
      assert contact.notes == "some notes"
      assert contact.favorite == true
    end

    test "create_contact/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = AddressBook.create_contact(@invalid_attrs)
    end

    test "update_contact/2 with valid data updates the contact" do
      contact = contact_fixture()
      update_attrs = %{first: "some updated first", last: "some updated last", avatar: "some updated avatar", twitter: "some updated twitter", notes: "some updated notes", favorite: false}

      assert {:ok, %Contact{} = contact} = AddressBook.update_contact(contact, update_attrs)
      assert contact.first == "some updated first"
      assert contact.last == "some updated last"
      assert contact.avatar == "some updated avatar"
      assert contact.twitter == "some updated twitter"
      assert contact.notes == "some updated notes"
      assert contact.favorite == false
    end

    test "update_contact/2 with invalid data returns error changeset" do
      contact = contact_fixture()
      assert {:error, %Ecto.Changeset{}} = AddressBook.update_contact(contact, @invalid_attrs)
      assert contact == AddressBook.get_contact!(contact.id)
    end

    test "delete_contact/1 deletes the contact" do
      contact = contact_fixture()
      assert {:ok, %Contact{}} = AddressBook.delete_contact(contact)
      assert_raise Ecto.NoResultsError, fn -> AddressBook.get_contact!(contact.id) end
    end

    test "change_contact/1 returns a contact changeset" do
      contact = contact_fixture()
      assert %Ecto.Changeset{} = AddressBook.change_contact(contact)
    end
  end
end
