// var client = new XMLHttpRequest();
// client.open('GET', '/foo.txt');
// client.onreadystatechange = function () {
//     alert(client.responseText);
// }
// client.send();

class FileLoader {
    constructor() {
        this.bind()
        this.xml = new XMLHttpRequest();
    }

    load(url, _onLoad) {
        this.xml.open('GET', url)
        this.xml.onreadystatechange = () => {
            if (_onLoad == undefined)
                return
            _onLoad(this.xml.responseText)
        }
        this.xml.send()
    }

    onLoad() {

    }

    bind() {
        this.load = this.load.bind(this)
        this.onLoad = this.onLoad.bind(this)
    }
}

const _instance = new FileLoader()
export default _instance