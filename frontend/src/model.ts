export interface RegistrationRequest {
  email: string;
  password: string;
  name: string;
  age: number;
}

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  age: number;
}
