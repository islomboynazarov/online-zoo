export interface Pet {
  id: number;
  name: string;
  commonName: string;
  description: string;
}

export interface PetDetail extends Pet {
  scientificName?: string;
  type?: string;
  size?: string;
  diet?: string;
  habitat?: string;
  range?: string;
  fact?: string;
  latitude?: number;
  longitude?: number;
}

export interface Camera {
  id: number;
  petId: number;
  text: string;
}

export interface Feedback {
  id: number;
  city: string;
  month: string;
  year: string;
  text: string;
  name: string;
}

export interface ApiResponse<T> {
  data: T;
}

export interface User {
  id: number;
  login: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  data: {
    access_token: string;
    user: User;
  };
  message: string;
}

export interface LoginPayload {
  login: string;
  password: string;
}

export interface RegisterPayload {
  login: string;
  password: string;
  name: string;
  email: string;
}

export interface DonationPayload {
  petId: number;
  amount: number;
  name: string;
  email: string;
  cardNumber: string;
  expirationDate: string;
  cvv: string;
}

export interface CardInfo {
  cardNumber: string;
  expirationDate: string;
  cvv: string;
}

export enum ApiEndpoint {
  Pets = '/pets',
  Cameras = '/cameras',
  Feedback = '/feedback',
  Donations = '/donations',
  Login = '/auth/login',
  Register = '/auth/register',
}

export interface FavouriteItem {
  petId: number;
}

export interface DonationHistoryItem {
  petId: number;
  petName: string;
  amount: number;
  date: string;
}