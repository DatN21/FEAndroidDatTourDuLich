export interface User {
  roleId: string;
  id: number;
  name: string;
  phone: string;
  address: string;
  email: string;
  gender: string;
}

export interface ListUserResponse {
  userResponses: User[];
  totalPages: number;
}
