import { object, string, TypeOf } from 'zod'

export const createUserSchema = object({
    body: object({
        name: string({
            required_error: 'Name is required'
        }),
        password: string({
            required_error: 'Password is required'
        }).min(6, 'Password too short -- should be atleast 6 characters'),
        passwordConfirmation: string({
            required_error: 'Password Confirm is required'
        }),
        email: string({
            required_error: 'Email is required'
        }).email('Valid email is required')
    }).refine((data) => data.password === data.passwordConfirmation, {
        message: 'Password do not match',
        path: ['passwordConfirmation']
    })
})

export type CreateUserInput = TypeOf<typeof createUserSchema>;