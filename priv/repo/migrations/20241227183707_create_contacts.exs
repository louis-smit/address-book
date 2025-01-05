defmodule App.Repo.Migrations.CreateContacts do
  use Ecto.Migration

  def change do
    create table(:contacts) do
      add :first, :string
      add :last, :string
      add :avatar, :string
      add :twitter, :string
      add :notes, :string
      add :favorite, :boolean, default: false, null: false

      timestamps(type: :utc_datetime)
    end
  end
end
