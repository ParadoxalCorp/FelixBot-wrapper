"use strict";
const Collection = require("enmap");
const axios = require("axios");
let wrapper;

class FelixWrapper {
    constructor(options) {
        this.autoConversion = typeof options.autoConversion === "undefined" ? true : options.autoConversion;
        axios.default.defaults.baseURL = `${options.url}/api`;
        axios.default.defaults.headers.common['Authorization'] = `Bearer ${options.token}`;
        axios.default.defaults.headers.post['Content-Type'] = `application/json`;
        axios.default.defaults.timeout = options.timeout || 6000
        wrapper = this;
    }

    status() {
        return new Promise(async(resolve, reject) => {
            axios.default.get().then(res => resolve(true)).catch(err => resolve(false));
        });
    }

    getUser(user) {
        return new Promise(async(resolve, reject) => {
            axios.default.get(`/getUserData/${user}`).then(response => {
                if (Array.isArray(response.data) && wrapper.autoConversion) {
                    let users = new Collection();
                    response.data.forEach(u => { users.set(u.id, u); });
                    return resolve(users);
                }
                if (!response.data.mutualGuilds || !wrapper.autoConversion) {
                    return resolve(response.data);
                }
                const guilds = new Collection();
                response.data.mutualGuilds.forEach(guild => {
                    let channels = new Collection(),
                        roles = new Collection(),
                        members = new Collection(),
                        userPermissions = new Collection();
                    guild.channels.forEach(c => {
                        channels.set(c.id, c);
                    });
                    guild.roles.forEach(r => {
                        roles.set(r.id, r);
                    });
                    guild.members.forEach(m => {
                        members.set(m.id, m);
                    });
                    guild.userPermissions.map(c => {
                        userPermissions.set(c.name, c.allowed);
                    });
                    guild.channels = channels,
                        guild.roles = roles,
                        guild.members = members,
                        guild.userPermissions = userPermissions;
                    guilds.set(guild.id, guild);
                });
                response.data.mutualGuilds = guilds;
                resolve(response.data);
            }).catch(err => {
                reject(wrapper._genericErrorHandler(err));
            });
        });
    }

    getGuild(guild) {
        return new Promise(async(resolve, reject) => {
            axios.default.get(`/getGuildData/${guild}`).then(response => {
                if (Array.isArray(response.data) && wrapper.autoConversion) {
                    let guilds = new Collection();
                    response.data.forEach(u => { guilds.set(g.id, g); });
                    return resolve(guilds);
                }
                resolve(response.data);
            }).catch(err => {
                reject(wrapper._genericErrorHandler(err));
            });
        });
    }

    fetchClientValue(value) {
        return new Promise(async(resolve, reject) => {
            axios.default.get(`/getClientData/${value}`).then(response => {
                resolve(response.data);
            }).catch(err => {
                reject(wrapper._genericErrorHandler(err));
            });
        });
    }

    postUser(user) {
        return new Promise(async(resolve, reject) => {
            axios.default.post("/postUserData", JSON.stringify(user)).then(response => {
                resolve(response.data);
            }).catch(err => {
                reject(wrapper._genericErrorHandler(err));
            });
        });
    }

    postGuild(guild) {
        return new Promise(async(resolve, reject) => {
            axios.default.post("/postGuildData", JSON.stringify(guild)).then(response => {
                resolve(response.data);
            }).catch(err => {
                reject(wrapper._genericErrorHandler(err));
            });
        });
    }

    _genericErrorHandler(response) {
        if (response.code === "ECONNABORTED") {
            return {
                code: 408,
                message: 'timeout',
                data: 'timeout'
            }
        }
        return {
            code: response.response.status,
            message: response.response.statusText,
            data: response.response.data
        }
    }
}

module.exports = FelixWrapper;