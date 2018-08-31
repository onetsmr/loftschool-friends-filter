import VkService from './services/vk-service.js';
import LsService from './services/ls-service.js';

import FriendsComponent from './components/friends-component.js';

let vkService = new VkService();
let lsService = new LsService();

document.friendsComponent = new FriendsComponent(vkService, lsService);
document.friendsComponent.refreshAll();

//vkService.init(12345, 2)
//    .then(() => {
//        document.friendsComponent = new FriendsComponent(vkService, lsService);
//        document.friendsComponent.refreshAll();
//    })
//    .catch(e => {
//        console.error(e);
//        alert('Ошибка: ' + e.message);
//    });