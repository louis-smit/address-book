defmodule App.AddressBookFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `App.AddressBook` context.
  """

  @doc """
  Generate a contact.
  """
  def contact_fixture(attrs \\ %{}) do
    {:ok, contact} =
      attrs
      |> Enum.into(%{
        avatar: "some avatar",
        favorite: true,
        first: "some first",
        last: "some last",
        notes: "some notes",
        twitter: "some twitter"
      })
      |> App.AddressBook.create_contact()

    contact
  end
end
