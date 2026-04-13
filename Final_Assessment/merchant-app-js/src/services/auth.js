import { UserManager, WebStorageStateStore } from "oidc-client-ts";

const authConfig = {
    authority: 'https://cboi-auth-stage.isupay.in/application/o/merchant-web-application/',
    client_id: '02WnEFxSElzxzrv3Qht29IacaiO6qKa3pclXleoo',
    redirect_uri: window.location.origin + '/callback',
    // post_logout_redirect_uri: window.location.origin + '/login', // removed to prevent auto-redirect loop after logout
    response_type: 'code',
    scope: 'openid profile email offline_access authorities privileges user_name created adminName bankCode goauthentik.io/api',
    automaticSilentRenew: true,
    loadUserInfo: true,
    monitorSession: true,
    filterProtocolClaims: true,
    userStore: new WebStorageStateStore({
        store: window.sessionStorage,
    })
};

export const userManager = new UserManager(authConfig);
