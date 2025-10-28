export interface Role {
  roleId: number;
  roleName: string;
}

export interface UserDTO {
  userId: number;
  name: string;
  email: string;
  password?: string;
  profilePicture: string;
  createdAt: string;
  role: Role;
}

export interface LoginUserDTO {
  userId: number;
  name: string;
  email: string;
  password?: string;
  profilePicture: string;
  createdAt: string;
  roles: Role[];
}

export interface LoginRequest {
  name: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
  user: LoginUserDTO;
}
