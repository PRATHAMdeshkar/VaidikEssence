import { apiRequest } from '../api/client';
import { API_ROUTES } from '../api/routes';
import { getStoredToken } from '../storage/authStorage';

export interface ChatReference {
  chapter: number;
  topic: string;
  text: string;
}

export interface ChatResponse {
  message: string;
  references: ChatReference[];
}

export async function askQuestion(question: string): Promise<ChatResponse> {
  const token = await getStoredToken();

  return apiRequest<ChatResponse>({
    method: 'POST',
    endpoint: API_ROUTES.chat.ask,
    body: { question },
    token: token ?? undefined,
  });
}
