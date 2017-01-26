/**
 * Application.gs
 *
 * Author: 
 *      bruce davidson
 */
[indent=4]
uses SDL
uses SDL.Video
uses sdx.graphics.s2d
namespace sdx

    def inline sdlFailIf(cond: bool, reason: string)
        if cond
            raise new Exception.SDLException(reason + ", SDL error: " + SDL.get_error())
            GLib.Process.exit(0)

    /**
     * Core SDL Application
     */
    class Application : Object

        const YieldForEventsMS: int = 1000

        name : string
        width : int
        height : int
        defaultFont: string
        font: sdx.Font
        running : bool
        window : Window
        renderer : Renderer
        sprites : list of Sprite = new list of Sprite
        onetime : list of Sprite = new list of Sprite
        showFps : bool = false
        fpsSprite : private Sprite
        app: private ApplicationListener

        construct(width: int, height: int, base:string) 
            new Sdx(this, width, height, base) 

        def setApplicationListener(listener: ApplicationListener)
            app = listener

        /**
         * Run - start the game loop
         */
        def run() : int
            if initialize() == false do return -1
            app.create()
            while Sdx.input.processEvents() && Sdx.input.keys[Input.Keys.Esc] != 1
                Sdx.graphics.updateTime()
                app.render()
                if YieldForEventsMS > 0 do GLib.Thread.usleep(YieldForEventsMS) 
                draw()
                if showFps
                    if fpsSprite != null do fpsSprite = null
                    fpsSprite = new Sprite.text("%2.2f".printf(Sdx.graphics.fps), font, sdx.graphics.Color.AntiqueWhite)
                    fpsSprite.centered = false

            dispose()
            return 0

        /**
         * Draw the current frame
         *
         * @param delta ms
         */
        def virtual draw()
            renderer.set_draw_color(0x0, 0x0, 0x0, 0x0)
            renderer.clear()

            for var sprite in sprites
                sprite.render(this.renderer, sprite.x, sprite.y)

            if showFps && fpsSprite != null do fpsSprite.render(this.renderer, 0, 0)

            for var sprite in onetime  
                sprite.render(this.renderer, sprite.x, sprite.y)
                
            onetime = new list of Sprite           
            renderer.present()

        /**
         * Do the cleanup callback
         */
        def virtual dispose()
            pass

        /**
         * Initialize SDL
         */
        def virtual initialize() : bool

            sdlFailIf(SDL.init(SDL.InitFlag.VIDEO | SDL.InitFlag.TIMER | SDL.InitFlag.EVENTS) < 0, 
                "SDL could not initialize! SDL Error: %s")

            sdlFailIf(SDLImage.init(SDLImage.InitFlags.PNG) < 0, 
                "SDL_image could not initialize!")

            sdlFailIf(!SDL.Hint.set_hint(Hint.RENDER_SCALE_QUALITY, "1"), 
                "Warning: Linear texture filtering not enabled!!")

            window = new Window(name, Window.POS_CENTERED, Window.POS_CENTERED, width, height, WindowFlags.SHOWN)
            sdlFailIf(window == null, "Window could not be created!")

            renderer = Renderer.create(window, -1, RendererFlags.ACCELERATED | RendererFlags.PRESENTVSYNC)
            sdlFailIf(renderer == null, "Renderer could not be created!")

            renderer.set_draw_color(0xFF, 0xFF, 0xFF, 0)

            sdlFailIf(SDLTTF.init() == -1, "SDL_ttf could not initialize!")

            print "Initialize defaultFont = %s", defaultFont
            if defaultFont != ""
                font = new sdx.Font(Sdx.files.resource(defaultFont), 16)
                if font == null
                    showFps = false
                    print "Failed to load font, showFps set to false. SDL Error: %s", SDL.get_error()
                else
                    showFps = true
            
            /**
             * TODO: calculate best values for mixer.open
             */
            print "Initialized "
            sdlFailIf(SDLMixer.open(22050, SDL.Audio.AudioFormat.S16LSB, 2, 4096) == -1,
                "SDL_mixer unagle to initialize!")

            return true

