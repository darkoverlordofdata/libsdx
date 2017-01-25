/**
 * Texture.gs
 *
 * Copyright 2016 Dark Overlord of Data
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the he MIT License (MIT).
 *
 * Author: 
 *      bruce davidson
 */
[indent=4]
uses Gee
uses SDL
uses SDLImage
uses SDLTTF
uses GLib
uses sdx
uses sdx.files

namespace sdx.graphics

    class Texture : Object
        data: Video.Surface
        prop path: string
        prop width: int
            get
                return data.w
        prop height: int
            get
                return data.h

        construct(file: FileHandle)
            _path = file.getPath()
            var raw = file.getRWops()
            data = Texture.getSurface(file.getExt(), raw)


            // _path = file.getPath()
            // if Sdx.files.isResource && file.getType() == FileType.Resource
            //     var ptr = file.bytes()
            //     var rw = new RWops.from_mem((void*)ptr.get_data(), (int)ptr.get_size())
            //     data = new Video.Surface.from_bmp_rw(rw)
            
            // else 
            //     data = SDLImage.load(file.getPath())


        construct uri(path: string)
            this(Sdx.files.resource(path))

        //     _path = path
        //     if _path.index_of("resource:///") == 0
        //         var ptr  = GLib.resources_lookup_data(_path.substring(11), 0)
        //         var rw = new RWops.from_mem((void*)ptr.get_data(), (int)ptr.get_size())
        //         data = new Video.Surface.from_bmp_rw(rw)

        //     else if _path.index_of("file:///") == 0
        //         data = SDLImage.load(_path.substring(7))

        //     else
        //         data = SDLImage.load(_path)


        def setFilter(minFilter: int, magFilter: int)
            pass

        def setWrap(u: int, v: int)
            pass


        /**
         *  Load a Surface from raw memory
         *
         * @param ext file extension (encoding)
         * @param raw RWops memory ptr
         * @param the new Surface
         */
        def static getSurface(ext: string, raw: RWops): Video.Surface
            case ext
                when ".cur"
                    return SDLImage.load_cur(raw)
                when ".ico"
                    return SDLImage.load_ico(raw)
                when ".bmp"
                    return SDLImage.load_bmp(raw)
                when ".pnm"
                    return SDLImage.load_pnm(raw)
                when ".xpm"
                    return SDLImage.load_xpm(raw)
                when ".xcf"
                    return SDLImage.load_xcf(raw)
                when ".pvx"
                    return SDLImage.load_pcx(raw)
                when ".gif"
                    return SDLImage.load_gif(raw)
                when ".jpg"
                    return SDLImage.load_jpg(raw)
                when ".tif"
                    return SDLImage.load_tif(raw)
                when ".png"
                    return SDLImage.load_png(raw)
                when ".tga"
                    return SDLImage.load_tga(raw)
                when ".lbm"
                    return SDLImage.load_lbm(raw)
                when ".xv"
                    return SDLImage.load_xv(raw)
                when ".webp"
                    return SDLImage.load_webp(raw)

            sdlFailIf(true, "Unable to load image surface for "+ext)
            return null
            
