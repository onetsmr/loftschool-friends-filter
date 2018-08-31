import View from './../infrastructure/view-render.js';

export default class FriendsComponent {
    constructor(vkService, lsService) {
        this._vkService = vkService;
        this._lsService = lsService;

        this._vkFriends = this._vkService.getFriends();
        this._lsFriends = this._lsService.loadFriends();

        if (this._lsFriends.length > 0) {
            // Удаляем из левого списка друзей, уже добавленных в правый список
            for (var i = this._vkFriends.length - 1; i >= 0; i--) {
                let vkFriendId = this._vkFriends[i].id;

                let lsFriend = this._lsFriends.find((friend) => friend.id === vkFriendId);
                if (lsFriend) {
                    this._vkFriends.splice(i, 1);
                }
            }
        }

        // Инициализируем drag-and-drop
        let vkFriendsZone = document.getElementById('vkFriendsList');
        let lsFriendsZone = document.getElementById('lsFriendsList');

        this.initDnD([vkFriendsZone, lsFriendsZone]);
    }

    initDnD(zones) {
        let currentDrag;

        zones.forEach(zone => {
            zone.addEventListener('dragstart', (e) => {
                currentDrag = { source: zone, node: e.target };
            });

            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
            });

            zone.addEventListener('drop', (e) => {
                if (currentDrag) {
                    e.preventDefault();

                    if (currentDrag.source !== zone) {
                        if (currentDrag.source.id === 'vkFriendsList') {
                            // Тащим из левого списка в правый
                            this.addFriend(Number.parseInt(currentDrag.node.id));
                        }

                        if (currentDrag.source.id === 'lsFriendsList') {
                            // Тащим из правого списка в левый
                            this.removeFriend(Number.parseInt(currentDrag.node.id));
                        }
                    }

                    currentDrag = null;
                }
            });
        });
    }

    addFriend(friendId) {
        let friend = this._vkFriends.find((friend) => friend.id === friendId);
        if (!friend) {
            return;
        }

        this._vkFriends.remove(friend);
        this._lsFriends.push(friend);

        this.refreshAll();
    }

    removeFriend(friendId) {
        let friend = this._lsFriends.find((friend) => friend.id === friendId);
        if (!friend) {
            return;
        }

        this._lsFriends.remove(friend);
        this._vkFriends.push(friend);

        this.refreshAll();
    }

    save() {
        this._lsService.saveFriends(this._lsFriends);
    }

    filterData(friends, filterValue) {
        if (filterValue === undefined || filterValue === null || filterValue === '') {
            return friends;
        }

        return friends.filter(friend =>
            friend.firstName.toLowerCase().indexOf(filterValue.toLowerCase()) >= 0 ||
            friend.lastName.toLowerCase().indexOf(filterValue.toLowerCase()) >= 0
        );
    }

    refresh(componentId, buttonIcon, buttonClick, data) {
        let filterElement = document.getElementById(componentId + 'Search');
        let filterValue = filterElement ? filterElement.value : null;

        let model = {
            componentId: componentId,
            buttonIcon: buttonIcon,
            buttonClick: buttonClick,
            data: this.filterData(data, filterValue)
        };

        let container = document.getElementById(componentId + 'List');
        container.innerHTML = View.render('friends', model);
    }

    vkFriendsFilter() {
        this.refresh('vkFriends', '+', 'addFriend', this._vkFriends);
    }

    lsFriendsFilter() {
        this.refresh('lsFriends', 'x', 'removeFriend', this._lsFriends);
    }

    refreshAll() {
        this.vkFriendsFilter();
        this.lsFriendsFilter();
    }
}