defmodule App.AddressBook do
  @moduledoc """
  The AddressBook context.
  """

  import Ecto.Query, warn: false
  alias App.Repo

  alias App.AddressBook.Contact
  alias App.Accounts.User

  @doc """
  Returns the list of contacts.

  ## Examples

      iex> list_contacts()
      [%Contact{}, ...]

  """
  def list_contacts do
    Repo.all(Contact)
  end

  @doc """
  Returns the list of contacts by user

  ## Examples

      iex> list_contacts_by_user(user)
      [%Contact{}, ...]

  """
  def list_contacts_by_user(%User{} = user) do
    from(c in Contact,
      where: c.owner_id == ^user.id
    )
    |> Repo.all()
  end

  @doc """
  Gets a single contact.

  Raises `Ecto.NoResultsError` if the Contact does not exist.

  ## Examples

      iex> get_contact!(123)
      %Contact{}

      iex> get_contact!(456)
      ** (Ecto.NoResultsError)

  """
  def get_contact!(id), do: Repo.get!(Contact, id)

  @doc """
  Creates a contact.

  ## Examples

      iex> create_contact(%{field: value})
      {:ok, %Contact{}}

      iex> create_contact(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_contact(attrs \\ %{}) do
    %Contact{}
    |> Contact.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Creates a contact belonging to a user.

  ## Examples

      iex> create_contact(user, %{field: value})
      {:ok, %Contact{}}

      iex> create_contact(user, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_contact(%User{} = user, attrs) do
    %Contact{}
    |> Contact.changeset(attrs)
    |> Ecto.Changeset.put_assoc(:owner, user)
    |> Repo.insert()
  end

  @doc """
  Updates a contact.

  ## Examples

      iex> update_contact(contact, %{field: new_value})
      {:ok, %Contact{}}

      iex> update_contact(contact, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_contact(%Contact{} = contact, attrs) do
    contact
    |> Contact.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a contact.

  ## Examples

      iex> delete_contact(contact)
      {:ok, %Contact{}}

      iex> delete_contact(contact)
      {:error, %Ecto.Changeset{}}

  """
  def delete_contact(%Contact{} = contact) do
    Repo.delete(contact)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking contact changes.

  ## Examples

      iex> change_contact(contact)
      %Ecto.Changeset{data: %Contact{}}

  """
  def change_contact(%Contact{} = contact, attrs \\ %{}) do
    Contact.changeset(contact, attrs)
  end
end
