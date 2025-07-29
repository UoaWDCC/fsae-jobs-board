import { FsaeRole } from "../../models"
import { AdminStatus } from "../../models/admin.status"

export type AdminReview = {
    id: string,
    name: string,
    contact: string,
    email: string,
    role: FsaeRole,
    date: Date,
    status: AdminStatus,
}