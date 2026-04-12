"use client"
import Loading from "@/components/_components/loading"
import { Error as ErrorComponent } from "@/components/_components/error"
import { UsersHeader } from "@/components/users/users-header"
import { UsersSearch } from "@/components/users/users-search"
import { UsersTable } from "@/components/users/users-table"
import { UserModal } from "@/components/users/user-modal"
import { DeleteUserDialog } from "@/components/users/delete-user-dialog"
import { useUsers } from "@/hooks/use-users"

export default function UsersPage() {
    const {
        filtered, search, setSearch,
        loading, error, fetchUsers,
        modalOpen, editUser, form, setForm,
        formError, saving, deleteId, setDeleteId,
        openAdd, openEdit, closeModal,
        handleSave, handleDelete,
    } = useUsers()

    if (loading) return <Loading />
    if (error) return <ErrorComponent message={error} onRetry={fetchUsers} />

    return (
        <div className="space-y-6">
            <UsersHeader count={filtered.length} onAdd={openAdd} />
            <UsersSearch value={search} onChange={setSearch} />
            <UsersTable users={filtered} onEdit={openEdit} onDelete={setDeleteId} />
            <UserModal
                open={modalOpen}
                onClose={closeModal}
                editUser={editUser}
                form={form}
                onChange={setForm}
                onSave={handleSave}
                saving={saving}
                error={formError}
            />
            <DeleteUserDialog
                open={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={() => deleteId && handleDelete(deleteId)}
            />
        </div>
    )
}