defmodule App.Repo.Migrations.AddOwnerToContacts do
  use Ecto.Migration

  def change do
    alter table(:contacts) do
      add :owner_id, references(:users, on_delete: :delete_all), null: true
    end
  end
end
