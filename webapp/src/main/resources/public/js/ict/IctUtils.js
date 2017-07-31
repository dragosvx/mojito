class IctUtils {

    getDelimiter() {
        return "\u{E007F}";
    }

    hasIctMetadata(string) {
        return string.indexOf(this.getDelimiter()) !== -1;
    }

    extractIdFromString(string) {

        var split = string.split(this.getDelimiter());

        var res = {
            'id': this.decodeId(split[0]),
            'string': split[1]
        };

        return res;
    }

    injectIdInMessageFormat(messageFormat, id) {
        messageFormat = this.encodeId(id) + this.getDelimiter() + messageFormat;
        return messageFormat;
    }

    encodeId(id) {
        // probably need to be replaced 
        // https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding
        var base64 = btoa(id);
        return this.asciiToTagsBlock(base64);
    }
    
    asciiToTagsBlock(string) {
        var res = '';
        
        [...string].forEach(c => {
           if (c.charCodeAt(0) >= 32 && c.charCodeAt(0) <= 126) {
               res += String.fromCharCode(56128, 56352 - 32 + c.charCodeAt(0));
           } else {
               throw "Unsupported character to encode in Tags block.";
           }
        });
        
        return res;
    }
    
    tagsBlockToAscii(string) {
        var res = '';
        
        [...string].forEach(c => {
           if (c.charCodeAt(0) === 56128 && c.charCodeAt(1) >= 56352 && c.charCodeAt(1) <= 56446) {
               res += String.fromCodePoint(32 + c.charCodeAt(1) - 56352);
           } else {
               throw "Unsupported character to decode in Tags block.";
           }
        });
        
        return res;
    }
    
    decodeId(id) {
        var base64 = this.tagsBlockToAscii(id);
        return atob(base64);
    }
 
}

export default new IctUtils();