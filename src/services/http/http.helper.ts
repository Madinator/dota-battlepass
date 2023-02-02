import { useAuthStore } from "@/stores/auth";

export const getTokenFromCookies = (key: string) =>((new RegExp((key || '=')+'=(.*?); ','gm')).exec(document.cookie+'; ') ||['',null])[1];

export const authBetBoom = async () => {
    const authStore = useAuthStore();
    
    await authStore.login('RU', '71bc6111-75aa-4301-bb9b-e764cb6d9972');

    // window.parent.postMessage({ type: 'sync_user' }, '*');

    // window.addEventListener("message", receiveMessage, false);

    // function receiveMessage(event: any)
    // {
    //     if(event.data.type === 'betboom_user_token')
    //         // authStore.login(event.data.token, event.data.zone);
    //         authStore.login(event.data.zone, event.data.token);
    // }
}
