defmodule AppWeb.ContactJSON do
  alias App.AddressBook.Contact

  @doc """
  Renders a list of contacts.
  """
  def index(%{contacts: contacts}) do
    %{data: for(contact <- contacts, do: data(contact))}
  end

  @doc """
  Renders a single contact.
  """
  def show(%{contact: contact}) do
    %{data: data(contact)}
  end

  defp data(%Contact{} = contact) do
    %{
      id: contact.id,
      first: contact.first,
      last: contact.last,
      avatar: contact.avatar,
      twitter: contact.twitter,
      notes: contact.notes,
      favorite: contact.favorite
    }
  end
end
