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
  rideTypes: RideType[];
}

export interface Ad {
  id: string;
  imageUrl: string;
  link: string;
  counter: number;
}

export interface RideType {
  id: string;
  name: string;
  description: string;
  userId: string;
}
