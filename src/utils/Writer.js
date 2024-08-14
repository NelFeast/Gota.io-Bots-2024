module.exports = class {
    constructor(size){
        this.buffer = Buffer.allocUnsafe(size)
        this.byteOffset = 0
    }
    writeUint8(value){
        this.buffer.writeUInt8(value, this.byteOffset++)
    }
    writeUint16(value){
        this.buffer.writeUInt16LE(value, this.byteOffset)
        this.byteOffset += 2
    }
    writeInt32(value){
        this.buffer.writeInt32LE(value, this.byteOffset)
        this.byteOffset += 4
    }
    writeString(string){
        for(let i = 0; i < string.length; i++) this.writeUint8(string.charCodeAt(i))
        this.writeUint8(0)
    }
    writeString16(string){
        for(let i = 0; i < string.length; i++) this.writeUint16(string.charCodeAt(i))        
    }
}