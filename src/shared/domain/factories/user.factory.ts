import { User } from "../entity"
import { FactoryException } from "../exceptions"

export class UserFactory {
    public static create(infos: any): User {
        try {
            const user = new User(
                Number(infos.id),
                infos.uuid,
                infos.username,
                infos.email,
                infos.password,
                infos.included_at ? new Date(infos.included_at) : null,
                infos.modified_at ? new Date(infos.modified_at) : null,
            )

            return user
        } catch (error) {
            throw new FactoryException("Error creating user object!")
        }
    }
}
