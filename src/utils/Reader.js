module.exports = class {
    constructor(buffer){
        this.buffer = buffer
        this.byteOffset = 0
    }
    readUint8(){
        return this.buffer.readUInt8(this.byteOffset++)
    }
    readUint16(){
        const value = this.buffer.readUInt16LE(this.byteOffset)
        this.byteOffset += 2
        return value
    }
    readInt16(){
        const value = this.buffer.readInt16LE(this.byteOffset)
        this.byteOffset += 2
        return value
    }
    readInt32(){
        const value = this.buffer.readInt32LE(this.byteOffset)
        this.byteOffset += 4
        return value
    }
    readString() {
        let string = ''
        while(true){
            const charCode = this.readUint8()
            if (charCode === 0) break;
            string += String.fromCharCode(charCode)
        }
        return string
    }
}