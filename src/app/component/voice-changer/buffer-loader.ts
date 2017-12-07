export default class BufferLoader {
    private context: AudioContext;
    private urlList: Array<string>;
    private onload: (bufferList: Array<object>) => {};
    private bufferList: Array<AudioBuffer> = [];
    private loadCount                      = 0;

    constructor(context: AudioContext, urlList: Array<string>, callback) {
        this.context = context;
        this.urlList = urlList;
        this.onload  = callback;
    }

    loadBuffer(url: string, index: number) {
        const request: XMLHttpRequest = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';

        request.onload = () => {
            this.context.decodeAudioData(
                request.response,
                (buffer: AudioBuffer) => {
                    if (!buffer) {
                        alert('error decoding file data:' + url);
                        return;
                    }

                    this.bufferList[index] = buffer;
                    if (++this.loadCount === this.urlList.length) {
                        this.onload(this.bufferList);
                    }
                }
            );
        };

        request.onerror = () => {
            alert('BufferLoader: XHR error');
        };

        request.send();
    }

    load() {
        for (let i = 0; i < this.urlList.length; ++i) {
            this.loadBuffer(this.urlList[i], i);
        }
    }
}
