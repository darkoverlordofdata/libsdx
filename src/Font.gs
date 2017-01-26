/**
 * Sound.gs
 *
 * Wrapper for Mix_Chunk.WAV sound effect
 *
 * Copyright 2016 Dark Overlord of Data
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the he MIT License (MIT).
 *
 * Author: 
 *      bruce davidson
 */
[indent=4]

uses SDL
uses SDLTTF
uses GLib
uses sdx.files

namespace sdx

    class Font : Object

        prop path: string
        innerFont : SDLTTF.Font
        // need to hold on to this ptr for the life of the font to prevent segfault
        rw : private SDL.RWops 

        construct(file: FileHandle, size: int)
            _path = file.getPath()
            if Sdx.files.isResource //&& file.getType() == FileType.Resource
                var ptr = GLib.resources_lookup_data(_path, 0)
                rw = new RWops.from_mem((void*)ptr.get_data(), (int)ptr.get_size())
                innerFont = new SDLTTF.Font.RW(rw, 0, size)
            
            else 
                innerFont = new SDLTTF.Font(_path, size)
        

        construct uri(path: string, size: int)
            _path = path
            if _path.index_of("resource:///") == 0
                var ptr = GLib.resources_lookup_data(path.substring(11), 0)
                rw = new RWops.from_mem((void*)ptr.get_data(), (int)ptr.get_size())
                innerFont = new SDLTTF.Font.RW(rw, 0, size)
            
            else if _path.index_of("file:///") == 0
                innerFont = new SDLTTF.Font(_path.substring(7), size)

            else
                innerFont = new SDLTTF.Font(_path, size)
        

        /**
         *  load a sound effect from a file or resource
         *
         * @param path of the font file or resource
         * @param size of the font in points
         * @return new Font
         */
        // def static fromFile(path: string, size: int) : Font
        //     return new Font.uri(path, size)

        /**
         *  Render text for Sprite.fromRenderedText
         *
         * @param text to generate surface from
         * @param color foreground color of text
         * @return new Surface
         */
        def render(text : string, color : sdx.graphics.Color) : Video.Surface
            return innerFont.render(text, color.obj)
            
