export default class LsService {
    constructor() {
        this._key = 'friends';

        if (!localStorage[this._key]) {
            localStorage[this._key] = JSON.stringify([]);
        }
    }

    loadFriends() {
        return JSON.parse(localStorage[this._key]);
    }

    saveFriends(friends) {
        return localStorage[this._key] = JSON.stringify(friends);
    }
}