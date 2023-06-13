
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

export type UserAccountDto = {
    FirstName: string
    LastName: string
    Name: string
    Email: string | null
    Phone: string | null
    Street: string | null
    PostCode: string | null
    City: string | null
}

export type CartProduct = {
    id: number,
    q: number
}