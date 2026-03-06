import { ApiResponse, Pet, PetDetail, Camera, Feedback, AuthResponse, LoginPayload, RegisterPayload, DonationPayload } from '../types/interfaces';
import { ApiEndpoint } from '../types/interfaces';

const BASE_URL = 'https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod';

async function fetchData<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, options);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function getPets(): Promise<Pet[]> {
  const result = await fetchData<ApiResponse<Pet[]>>(ApiEndpoint.Pets);
  return result.data;
}

export async function getPetById(id: number): Promise<PetDetail> {
  const result = await fetchData<ApiResponse<PetDetail>>(`${ApiEndpoint.Pets}/${id}`);
  return result.data;
}

export async function getCameras(): Promise<Camera[]> {
  const result = await fetchData<ApiResponse<Camera[]>>(ApiEndpoint.Cameras);
  return result.data;
}

export async function getFeedback(): Promise<Feedback[]> {
  const result = await fetchData<ApiResponse<Feedback[]>>(ApiEndpoint.Feedback);
  return result.data;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  return fetchData<AuthResponse>(ApiEndpoint.Login, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  return fetchData<AuthResponse>(ApiEndpoint.Register, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function postDonation(payload: DonationPayload): Promise<void> {
  await fetchData<void>(ApiEndpoint.Donations, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}