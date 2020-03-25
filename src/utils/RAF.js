class RAF {
    constructor() {
        this.bind()
        this.callbacks = []

    }

    subscribe(name, callback) {
        this.callbacks.push({
            name: name,
            callback: callback
        })
    }

    unsubscribe(name) {
        this.callbacks.forEach((item, i) => {
            if (item.name == name)
                this.callbacks.splice(i, i + 1)
        });
    }

    render() {
        this.callbacks.forEach(item => {
            item.callback
        });
        console.log('hey')
    }

    bind() {
        this.subscribe = this.subscribe.bind(this)
        this.unsubscribe = this.unsubscribe.bind(this)
        this.render = this.unsubscribe.bind(this)

        requestAnimationFrame(this.render)
    }
}