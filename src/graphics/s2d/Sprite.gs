/**
 * Sprite.gs
 *
 * Wrapper for Texture with a Surface
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
uses SDLImage
uses SDLTTF
uses GLib
uses sdx
uses sdx.files

namespace sdx.graphics.s2d

    struct Scale
        x : double
        y : double

    class Sprite : Object
        uniqueId : static int = 0
        texture : Video.Texture
        width : int
        height : int
        x : int
        y : int
        scale : Scale = Scale() { x = 1.0, y = 1.0 }
        color : Video.Color = Video.Color() { r = 255, g = 255, b = 255, a = 255 }
        centered : bool = true
        layer : int = 0
        id : int = ++uniqueId
        path: string

        construct(path: string="")
            //if path != "" do this.file(Sdx.files.resource(path))
            pass

        /**
         *  Create sprite from fileHandle
         *
         * @param file fileHandle
         */
        construct file(file: FileHandle)
            path = file.getPath()
            var raw = file.getRWops()
            var surface = Texture.getSurface(file.getExt(), raw)

            texture = Video.Texture.create_from_surface(Sdx.app.renderer, surface)
            sdlFailIf(texture == null, "Unable to load image texture!")

            texture.set_blend_mode(Video.BlendMode.BLEND)
            width = surface.w
            height = surface.h

        /**
         *  Create sprite from Atlas region
         *
         * @param region Atlas region
         */
        construct region(region: TextureAtlas.AtlasRegion)
            var flags = (uint32)0x00010000  // SDL_SRCALPHA
            var rmask = (uint32)0x000000ff  
            var gmask = (uint32)0x0000ff00
            var bmask = (uint32)0x00ff0000
            var amask = (uint32)0xff000000

            var x = region.top
            var y = region.left
            var w = region.width
            var h = region.height
            var surface = new Video.Surface.legacy_rgb(flags, region.width, region.height, 
                    32, rmask, gmask, bmask, amask)
            region.texture.data.blit({x, y, w, h}, surface, {0, 0, w, h})
            this.texture = Video.Texture.create_from_surface(Sdx.app.renderer, surface)
            this.texture.set_blend_mode(Video.BlendMode.BLEND)
            this.width = surface.w
            this.height = surface.h
            this.path = region.name

        /**
         *  Create sprite from text value of a Sprite.fromRenderedText
         *
         * @param text string of text to generate
         * @param font used to generate text
         * @param color foregound text color (background transparent)
         */
        construct text(text : string, font : Font, color : sdx.graphics.Color)
            var surface = font.render(text, color)

            texture = Video.Texture.create_from_surface(Sdx.app.renderer, surface)
            sdlFailIf(texture == null, "Unable to load image texture!")

            texture.set_blend_mode(Video.BlendMode.BLEND)
            width = surface.w
            height = surface.h
            path = ""

        /**
         *  Change the text value of a Sprite.fromRenderedText
         *
         * @param text string of text to generate
         * @param font used to generate text
         * @param color foregound text color (background transparent)
         */
        def setText(text : string, font : Font, color : sdx.graphics.Color)
            var surface = font.render(text, color)

            texture = Video.Texture.create_from_surface(Sdx.app.renderer, surface)
            sdlFailIf(texture == null, "Unable to load image texture!")

            texture.set_blend_mode(Video.BlendMode.BLEND)
            width = surface.w
            height = surface.h
            path = ""

        /**
         *  Render the sprite on the Video.Renderer context
         *
         * @param renderer video context
         * @param x display coordinate
         * @param y display coordinate
         * @param clip optional clipping rectangle
         */
        def render(renderer: Video.Renderer, x : int, y : int, clip : Video.Rect? = null)
            /* do clipping? */
            var w = (int)((clip == null ? width : clip.w) * scale.x)
            var h = (int)((clip == null ? height : clip.h) * scale.y)

            /* center in display? */
            x = centered ? x-(w/2) : x
            y = centered ? y-(h/2) : y

            /* apply current tint */
            texture.set_color_mod(color.r, color.g, color.b)
            /* copy to the rendering context */
            renderer.copy(texture, null, {x, y, w, h})


