import { Role } from "../model/role";

export interface UserResponse {
    id: number;
    name: string;
    phone: string;
    address: string;
    email: string;
    gender: string;
    roleId:string ;
}
