import { z } from "zod";

const updateAdmin = z.object({
    body: z.object({
    contactNumber: z.string()
    })
})

export const AdminValidation = {
    updateAdmin
}