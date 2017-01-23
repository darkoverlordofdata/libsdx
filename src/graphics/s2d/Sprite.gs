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
        scale : Scale = Scale() {
            x = 1.0,
            y = 1.0
        }
        color : Video.Color = Video.Color() {
            r = 255,
            g = 255,
            b = 255,
            a = 255            
        }
        centered : bool = true
        layer : int = 0
        id : int = ++uniqueId
        path: string

        construct()
            pass

        construct region(region:TextureAtlas.AtlasRegion)
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
         *  Create a sprite from text
         *
         * @param renderer video context
         * @param font used to generate text
         * @param text string of text to generate
         * @param color foregound text color (background transparent)
         * @return new Sprite
         */
        def static fromRenderedText(renderer: Video.Renderer, font : sdx.Font?, text : string, color : sdx.graphics.Color) : Sprite?
            var sprite = new Sprite()
            var textSurface = font.render(text, color)
            sprite.path = text

            if textSurface == null
                print "Unable to render text surface!"
                return null
            else
                sprite.texture = Video.Texture.create_from_surface(renderer, textSurface)
                if sprite.texture == null
                    print "Unable to create texture from rendered text! SDL Error: %s", SDL.get_error()
                    return null
                else
                    sprite.width = textSurface.w
                    sprite.height = textSurface.h
            return sprite

        /**
         *  Extract a sprite from atlas
         *
         * @param renderer video context
         * @param atlas libgdx format sprite pack
         * @param name of the sprite to extract
         * @return new Sprite
         */
        def static fromAtlas(renderer: Video.Renderer, atlas: TextureAtlas, name : string) : Sprite?
            var flags = (uint32)0x00010000  // SDL_SRCALPHA
            var rmask = (uint32)0x000000ff  
            var gmask = (uint32)0x0000ff00
            var bmask = (uint32)0x00ff0000
            var amask = (uint32)0xff000000

            for region in atlas.regions
                if region.name == name
                    var x = region.top
                    var y = region.left
                    var w = region.width
                    var h = region.height
                    var surface = new Video.Surface.legacy_rgb(flags, region.width, region.height, 
                            32, rmask, gmask, bmask, amask)
                    region.texture.data.blit({x, y, w, h}, surface, {0, 0, w, h})
                    var sprite = new Sprite()
                    sprite.texture = Video.Texture.create_from_surface(renderer, surface)
                    sprite.texture.set_blend_mode(Video.BlendMode.BLEND)
                    sprite.width = surface.w
                    sprite.height = surface.h
                    sprite.path = name
                    return sprite
            return null

        /**
         *  load a sprite from a file or resource
         *
         * @param renderer video context
         * @param path of the sprite file or resource
         * @return new Sprite
         */
        def static fromFile(renderer: Video.Renderer, path: string) : Sprite?
            surface: Video.Surface
            var sprite = new Sprite()
            sprite.path = path

            if path.index_of("resource:///") == 0
                try
                    var ptr  = GLib.resources_lookup_data(path.substring(11), 0)
                    var rw = new RWops.from_mem((void*)ptr.get_data(), (int)ptr.get_size())
                    surface = new Video.Surface.from_bmp_rw(rw)
                except e: Error
                    surface = null
                    print "Error loading resource: %s\n", e.message
                    return null

            else
                surface = SDLImage.load(path)

            if surface == null
                print "Unable to load image! SDL Error: %s", SDL.get_error()
                return null
             else
                sprite.texture = Video.Texture.create_from_surface(renderer, surface)
                sprite.texture.set_blend_mode(Video.BlendMode.BLEND)
                if sprite.texture == null
                    print "Unable to create texture from %s! SDL Error: %s", path, SDL.get_error()
                 else
                    sprite.width = surface.w
                    sprite.height = surface.h
            return sprite


        /**
         *  Change the text value of a Sprite.fromRenderedText
         *
         * @param renderer video context
         * @param font used to generate text
         * @param text string of text to generate
         * @param color foregound text color (background transparent)
         */
        def setText(renderer: Video.Renderer, font : sdx.Font, text : string, color : sdx.graphics.Color)
            var textSurface = font.innerFont.render(text, color.obj)

            if textSurface == null
                print "Unable to render text surface"

            else
                this.texture = Video.Texture.create_from_surface(renderer, textSurface)
                if this.texture == null
                    print "Unable to create texture from rendered text! SDL Error: %s", SDL.get_error()
                else
                    this.width = textSurface.w
                    this.height = textSurface.h

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


