const Collection = require("enmap");
const unirest = require("unirest");

class FelixWrapper {
    constructor(options) {
        this.url = `${options.url}/api`;
        this.token = `Bearer ${options.token}`;
        this.timeout = options.timeout || 3000;
        this.autoConversion = options.autoConversion === false ? false : true;
    }

    /**
     * Returns a boolean of whether Felix's API is up or down
     * @param {Object} [options] An optional object of options
     * @param {number} [options.timeout=this.timeout] Time in milliseconds before the request should abort, default is the timeout set in the constructor or 3000
     * @returns {Promise<boolean>}
     */
    status(options = {}) {
        const wrapper = this;
        return new Promise(async(resolve, reject) => {
            unirest.get(`${wrapper.url}`)
                .timeout(options.timeout ? options.timeout : wrapper.timeout)
                .end(response => {
                    resolve(response.statusCode === 200 ? true : false);
                });
        });
    }

    /**
     * Get one or multiple users from the database
     * @param {String||Array} user A user ID or an array of IDs, if none provided, will return a collection of all users
     * @param {Object} [options] An optional object of options
     * @param {number} [options.timeout=this.timeout] Time in milliseconds before the request should abort, default is the timeout set in the constructor or 3000
     * @returns {Promise<User||Collection<ID, User>>}
     */
    getUser(user, options = {}) {
        const wrapper = this;
        return new Promise(async(resolve, reject) => {
            unirest.get(`${wrapper.url}/getUserData/${user}`)
                .header(`Authorization`, wrapper.token)
                .timeout(options.timeout ? options.timeout : wrapper.timeout)
                .end(response => {
                    if (typeof response.error === "object" && response.error.Error === "ETIMEDOUT") return reject("timeout");
                    if (response.statusCode !== 200) return reject(response.body);
                    if (Array.isArray(response.body)) {
                        let users = new Collection();
                        response.body.forEach(u => { users.set(u.id, u) });
                        return resolve(users);
                    }
                    if (!response.body.mutualGuilds || !wrapper.autoConversion) return resolve(response.body);
                    let guilds = new Collection();
                    response.body.mutualGuilds.forEach(guild => {
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
                    response.body.mutualGuilds = guilds;
                    resolve(response.body);
                });
        });
    }

    /**
     * Get one or multiple guilds from the database
     * @param {String||Array} guilds A guild ID or an array of IDs, if none provided, will return a collection of all guilds
     * @param {Object} [options] An optional object of options
     * @param {number} [options.timeout=this.timeout] Time in milliseconds before the request should abort, default is the timeout set in the constructor or 3000
     * @returns {Promise<Guild||Collection<ID, Guild>>}
     */
    getGuild(guild, options = {}) {
        const wrapper = this;
        return new Promise(async(resolve, reject) => {
            unirest.get(`${wrapper.url}/getGuildData/${guild}`)
                .header(`Authorization`, wrapper.token)
                .timeout(options.timeout ? options.timeout : wrapper.timeout)
                .end(response => {
                    if (typeof response.error === "object" && response.error.Error === "ETIMEDOUT") return reject("timeout");
                    if (response.statusCode !== 200) return reject(response.body);
                    if (!wrapper.autoConversion) return resolve(response.body);
                    if (Array.isArray(response.body)) {
                        let guilds = new Collection();
                        response.body.forEach(u => { guilds.set(g.id, g) });
                        return resolve(guilds);
                    }
                    resolve(response.body);
                });
        });
    }

    /**
     * Fetch a value of Felix, this is restricted to private tokens only 
     * @param {String} value The value to fetch, this will be interpreted as the name of the property
     * @param {Object} [options] An optional object of options
     * @param {number} [options.timeout=this.timeout] Time in milliseconds before the request should abort, default is the timeout set in the constructor or 3000
     * @returns {Promise<value>}
     */
    fetchClientValue(value, options = {}) {
        const wrapper = this;
        return new Promise(async(resolve, reject) => {
            unirest.get(`${wrapper.url}/getClientData/${value}`)
                .header(`Authorization`, wrapper.token)
                .timeout(options.timeout ? options.timeout : wrapper.timeout)
                .end(response => {
                    if (typeof response.error === "object" && response.error.Error === "ETIMEDOUT") return reject("timeout");
                    if (response.statusCode !== 200) return reject(response.body);
                    resolve(response.body);
                });
        });
    }

    /**
     * Restricted to private tokens: Create or update a user entry in the database, returns true if the operation is a success
     * @param {Object} user The user object, the object must be valid otherwise the API will reject the request
     * @param {Object} [options] An optional object of options
     * @param {number} [options.timeout=this.timeout] Time in milliseconds before the request should abort, default is the timeout set in the constructor or 3000
     * @returns {Promise<boolean||array>}
     */
    postUser(user, options = {}) {
        const wrapper = this;
        return new Promise(async(resolve, reject) => {
            unirest.post(`${wrapper.url}/postUserData`)
                .header(`Authorization`, wrapper.token)
                .header(`Content-Type`, `application/json`)
                .timeout(options.timeout ? options.timeout : wrapper.timeout)
                .send(JSON.stringify(user))
                .end(response => {
                    if (typeof response.error === "object" && response.error.Error === "ETIMEDOUT") return reject("timeout");
                    if (response.statusCode !== 200 || Array.isArray(response.body)) return reject(response.body);
                    resolve(response.body);
                });
        });
    }

    /**
     * Restricted to private tokens: Create or update a guild entry in the database, returns true if the operation is a success
     * @param {Object} guild The guild object, the object must be valid otherwise the API will reject the request
     * @param {Object} [options] An optional object of options
     * @param {number} [options.timeout=this.timeout] Time in milliseconds before the request should abort, default is the timeout set in the constructor or 3000
     * @returns {Promise<boolean||array>}
     */
    postGuild(guild, options = {}) {
        const wrapper = this;
        return new Promise(async(resolve, reject) => {
            unirest.post(`${wrapper.url}/postGuildData`)
                .header(`Authorization`, wrapper.token)
                .header(`Content-Type`, `application/json`)
                .timeout(options.timeout ? options.timeout : wrapper.timeout)
                .send(JSON.stringify(guild))
                .end(response => {
                    if (typeof response.error === "object" && response.error.Error === "ETIMEDOUT") return reject("timeout");
                    if (response.statusCode !== 200 || Array.isArray(response.body)) return reject(response.body);
                    resolve(response.body);
                });
        });
    }
}

module.exports = FelixWrapper;