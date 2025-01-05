defmodule App.AddressBook.Contact do
  use Ecto.Schema
  import Ecto.Changeset

  schema "contacts" do
    field :first, :string
    field :last, :string
    field :avatar, :string
    field :twitter, :string
    field :notes, :string
    field :favorite, :boolean, default: false

    belongs_to :owner, App.Accounts.User

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(contact, attrs) do
    contact
    |> cast(attrs, [:first, :last, :avatar, :twitter, :notes, :favorite])
    |> validate_required([])
  end
end
