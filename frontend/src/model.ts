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
  rides: RideEntry[];
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

export enum RideEntryType {
  ROUTE = 'route',
  DURATION = 'duration',
  CONSUMPTION = 'consumption',
}

export interface NewRideEntry {
  date: Date;
  value: number;
  typeId: string;
  typeName: string;
  rideEntryType: RideEntryType;
}

export interface RideEntry {
  id: string;
  date: string;
  value: number;
  typeId: string;
  typeName: string;
  rideEntryType: RideEntryType;
}
