import { Spine } from "../../Spine.js";

export async function handleGuildMemberRemove(user) {
    const userId = user.user.id
    const username = user.user.username

    const dateNow = new Date();
    var utc = new Date(dateNow.getUTCFullYear(), dateNow.getUTCMonth(), dateNow.getUTCDate(), dateNow.getUTCHours(), dateNow.getUTCMinutes(), dateNow.getUTCSeconds());
    const utcStr = dateNow.getDate() + '/' + (dateNow.getMonth() + 1) + '/' + dateNow.getFullYear() + ' ' + utc.getHours() + ':' + utc.getMinutes() + ':' + utc.getSeconds()
    
    Spine.getInstance.sendUserUpdateEvent('Discord', 'leave', username, utcStr)
};