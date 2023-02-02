import { httpService } from '@/services/http/http.service';
import type { UserData } from '../auth/models';
import type { PrizeRequest, UserAcountsInfo } from './models';

const MDBaseUrl = import.meta.env.VITE_MD_BASE_URL;
const spaceId = import.meta.env.VITE_SPACE_ID;
const path = '/users'

export const userApiService = {
    getPrizesList: async (): Promise<TypedResponse<PrizeRequest[]>> => {
        return await httpService.get(`${spaceId}${path}/my/prizes`)
    },
    getMe: async (): Promise<TypedResponse<UserData>> => {
        return await httpService.post(`${spaceId}${path}/me`, {});
    },
    getAccountsInfo: async (): Promise<TypedResponse<UserAcountsInfo>> => {
        return await httpService.get(`${MDBaseUrl}${path}/link/accounts`, {})
    },
    me: async (): Promise<TypedResponse<UserData>> => {
        return await httpService.post(`${MDBaseUrl}/auth/me`, {});
    },
}
