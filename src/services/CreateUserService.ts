import { UsersRepositories } from "../repositories/UsersRepositories";
import {getCustomRepository} from 'typeorm'
import {hash} from 'bcryptjs'

interface iUserRequest {
    name: string;
    email: string;
    admin?: boolean;
    password: string;
}

class CreateUserService {
    async execute({ name, email, admin = false, password }: iUserRequest) {

        const usersRepository =  getCustomRepository(UsersRepositories);

        if (!email) {
            throw new Error("Email incorrect");
        }

        const userAlreadyExists = await usersRepository.findOne({ email });

        if (userAlreadyExists) {
            throw new Error("User already exists");
        }

        if(!password) {
            throw new Error("Password required for create user")
        }

        const passwordHash = await hash(password, 8)

        const user = usersRepository.create({
            name,
            email,
            admin,
            password: passwordHash
        });

        await usersRepository.save(user);

        return user;
    }
}

export { CreateUserService };
