import { httpService } from '@/services/http/http.service';
import type { QuestsRequest } from './models';

const spaceId = import.meta.env.VITE_SPACE_ID;

export const questApiService = {
    getQuestsList: async (): Promise<TypedResponse<QuestsRequest>> => {
        return await httpService.get(`${spaceId}/weeks/active`, { type: 'games' })
    }
}
