class Genify {
    constructor() {
        this.genhash = this._getHashFromUrl();
        this.genhash = (this.genhash && this.genhash.length === 66) ? this.genhash : this._generateHash();
        this._initRandom();
        this._setupMessageListener();
    }

    _getHashFromUrl() {
        const params = new URLSearchParams(window.location.search);
        const hash = params.get('genhash');
        return hash && hash.length === 66 ? hash : null;
    }

    _generateHash() {
        return '0x' + [...Array(64)]
            .map(() => Math.floor(Math.random() * 16).toString(16))
            .join('');
    }

    _initRandom() {
        this._random = this._createAlea(this._crc32(this.genhash));
    }

    _setupMessageListener() {
        window.addEventListener("message", (event) => {
            if (event.data === "gen_getFeatures") {
                parent.postMessage({
                    id: "gen_getFeatures",
                    data: window.$genFeatures
                }, "*");
            }
        });
    }

    _crc32(str) {
        const table = "00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5"
            .split(' ')
            .map(s => parseInt(s, 16));
            
        let crc = -1;
        for(let i = 0; i < str.length; i++) {
            crc = (crc >>> 8) ^ table[(crc ^ str.charCodeAt(i)) & 0xFF];
        }
        return (crc ^ (-1)) >>> 0;
    }

    _createAlea(seed) {
        function Mash() {
            let n = 4022871197;
            return function(r) {
                let t, s, f;
                for(let u = 0, e = 0.02519603282416938; u < r.length; u++)
                s = r.charCodeAt(u), f = (e * (n += s) - (n*e|0)),
                n = 4294967296 * ((t = f * (e*n|0)) - (t|0)) + (t|0);
                return (n|0) * 2.3283064365386963e-10;
            }
        }
    
        return (function() {
            let m = Mash();
            let a = m(this.genhash.slice(0, 22));
            let b = m(this.genhash.slice(22, 44));
            let c = m(this.genhash.slice(44));
            let x = 1;
    
            seed = seed.toString();
            a -= m(seed);
            b -= m(seed);
            c -= m(seed);
            a < 0 && a++; 
            b < 0 && b++;
            c < 0 && c++;
            
            return function() {
                let y = x * 2.3283064365386963e-10 + a * 2091639;
                a = b, b = c;
                return c = y - (x = y|0);
            };
        }).call(this);
    }

    reset() {
        this._initRandom();
    }

    random() {
        return this._random();
    }

    randInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(this.random() * (max - min)) + min;
    }

    randFloat(min, max) {
        return this.random() * (max - min) + min;
    }

    choice(arr) {
        return arr[this.randInt(0, arr.length)];
    }

    setFeatures(features) {
        window.$genFeatures = features;
        console.table(window.$genFeatures);
        parent.postMessage({
            id: "gen_getFeatures",
            data: window.$genFeatures
        }, "*");
    }

    renderDone() {
        window.$renderOK = true;
        parent.postMessage({
            id: "gen_renderDone",
            data: true
        }, "*");
    }
}

window.genify = new Genify();