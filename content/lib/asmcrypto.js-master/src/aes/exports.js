// shared asm.js module and heap
var _aes_heap_instance = new Uint8Array(0x100000),
    _aes_asm_instance  = aes_asm( global, null, _aes_heap_instance.buffer );
