/**
 * Exception.gs
 *
 * 
 *
 */
[indent=4]
namespace sdx

    exception Exception 
        IllegalArgumentException
        IllegalStateException
        SdxRuntimeException
        NullPointerException
        NoSuchElementException

    exception IOException 
        FileNotFound
        FileNoPermission
        FileIsLocked
        InvalidData
