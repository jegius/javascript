const SkillShareServer = require('./objects/slillShareServer');
const {defaultHeaders} = require("./objects/varribles");

new SkillShareServer(Object.create(null)).start(8000);

SkillShareServer.prototype.talkResponse = function () {
    let talks = [];

    for (let title of Object.keys(this.talks)) {
        talks.push(this.talks[title])
    }
    return {
        body: JSON.stringify(talks),
        headers: {
            ...defaultHeaders,
            'Content-Type': 'application/json',
            'ETag': `"${this.version}"`
        }
    }
};

SkillShareServer.prototype.waitForChanges = function(time) {
    return new Promise(resolve => {
        this.waiting.push(resolve);
        setTimeout(() => {
            if (!this.waiting.includes(resolve)) {
                return;
            }

            this.waiting = this.waiting.filter( r => r !== resolve);
            resolve({status: 304});
        }, time * 1000)
    })
};

SkillShareServer.prototype.updated = function() {
    this.version++;
    let response =  this.talkResponse();
    this.waiting.forEach(resolve => resolve(response));
    this.waiting = [];
};