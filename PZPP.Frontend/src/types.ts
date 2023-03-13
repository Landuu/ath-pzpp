
export type UserContext = {
    UID: number
    Login: string
    FirstName: string
    LastName: string
    Name: string
    IsAdmin: boolean
}

export type LoginDto = {
    Login: string,
    Password: string
}

export type RegisterDto = {
    FirstName: string,
    LastName: string,
    Login: string,
    Password: string
}