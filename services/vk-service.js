export default class VkService {
    constructor() {

    }

    init(appId, permissions) {
        return new Promise((resolve, reject) => {
            VK.init({
                apiId: appId
            });

            VK.Auth.login(response => {
                if (response.session) {
                    resolve(response);
                } else {
                    reject(new Error('Не удалось авторизоваться'));
                }
            }, permissions);
        });
    }

    callApi(method, params) {
        params.v = params.v || '5.78';

        return new Promise((resolve, reject) => {
            VK.api(method, params, response => {
                if (response.error) {
                    reject(new Error(response.error.error_msg));
                } else {
                    resolve(response.response);
                }
            });
        });
    }

    getFriends(params = {}) {
        //return this.callApi('friends.get', params);
        return [
            { id: 1, firstName: 'Иван', lastName: 'Иванов', photo: '' },
            { id: 2, firstName: 'Петр', lastName: 'Петров', photo: '' },
            { id: 3, firstName: 'Сидор', lastName: 'Сидоров', photo: '' },
        ];
    }
}