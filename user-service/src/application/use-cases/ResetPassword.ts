import { UserRepository } from "../../infrastructure/repositories/UserRepository";

export class ResetPassword {
    constructor (private readonly userRepository: UserRepository) {}

    async execute (email: string, password: string) {
        this.validatePassword(password);
        const updatedUser = await this.userRepository.updateUserByEmail(email, {password});
        if(!updatedUser)
            throw Object.assign(new Error('User not fond within the email'),  {statusCode: 404})
        return true;
    }

    private validatePassword (password: string) {
        if(!password)
            throw Object.assign(new Error("Password required"), {statusCode: 400})
        if(password.trim().length < 8)
            throw Object.assign(new Error("Invalid password"), {statusCode: 400})
    }
}