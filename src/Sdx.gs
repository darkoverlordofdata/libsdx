/**
 * Sdx.gs
 *
 * Author: 
 *      bruce davidson
 */
[indent=4]
namespace sdx

    class Sdx : Object

        prop static readonly app: Application
        prop static readonly graphics: Graphics
        prop static readonly audio: Audio
        prop static readonly input: Input
        prop static readonly files: Files
        prop static readonly net: Net = new Net()

        construct(app: Application, width: int, height: int, base: string)
            _app = app
            app.width = width
            app.height = height
            _graphics = new Graphics().setSize(width, height)
            _audio = new Audio()
            _input = new Input()
            _files = new Files(base)
            new sdx.graphics.Color(0)
            print "Sdx is initialized."

        
