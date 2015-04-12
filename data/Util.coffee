
# Static method utilities       - Util is a global without a functional wrapper
# coffee -c -bare Util.coffee   - prevents function wrap to put Util in global namespace

class Util

  Util.debug     = true
  Util.count     = 0
  Util.modules   = []
  Util.instances = []
  Util.root      = ''
  Util.paths     = {} # Set by loadInitLibs for future reference in calls to loadModule(s)
  Util.libs      = {} # Set by loadInitLibs for future reference in calls to loadModule(s)
  Util.rejectionTrackingStopped = false
  Util.logStackNum = 0
  Util.logStackMax = 100

  # ------ Modules ------

  @init:() ->
    window['Promise'] = ES6Promise.Promise if ES6Promise?

  @hasMethod:( obj, method ) ->
    has = typeof obj[method] is 'function'
    Util.log( 'Util.hasMethod()', method, has )
    has

  @undefExports:() ->
    window.exports = undefined

  @saveUndefExports:() ->
    Util.log( 'Util.saveUndefExports()', typeof exports, typeof window.exports, typeof root.exports )
    Util.exports   = window.exports
    exports        = undefined
    window.exports = undefined
    root.exports   = undefined

  @restoreExports:() ->
    window.exports = Util.exports
    Util.exports   = undefined

  @promise:( resolve, reject ) ->
    if    ES6Promise?
      new ES6Promise.Promise( resolve, reject )
    else
      Util.error( 'Util.promise() ES6Promise missing so returning null' )
      null

  @hasGlobal:( global, issue=true ) ->
    if not global?
      Util.trace(  global )
      return false
    has = window[global]?
    Util.error( "Util.hasGlobal() #{global} not present" )  if not has and issue
    has

  @getGlobal:( global, issue=true ) ->
    if Util.hasGlobal( global, issue ) then window[global] else null

  @hasPlugin:( plugin, issue=true ) ->
    glob = Util.firstTok(plugin,'.')
    plug = Util.lastTok( plugin,'.')
    has  = window[glob]? and window[glob][plug]?
    Util.error( "Util.hasPlugin()  $#{glob+'.'+plug} not present" )  if not has and issue
    has

  @hasModule:( path, issue=true ) ->
    has = Util.modules[path]?
    Util.error( "Util.hasModule() #{path} not present" )  if not has and issue
    has

  @dependsOn:() ->
    ok = true
    for arg in arguments
      has = Util.hasGlobal(arg,false) or Util.hasModule(arg,false) or Util.hasPlugin(arg,false)
      Util.error( 'Missing Dependency', arg ) if not has
      ok &= has
    ok

  @verifyLoadModules:(lib,modules,global=undefined) ->
    ok  = true
    for module in modules
      has = if global? then Util.hasGlobal(global,false) or Util.hasPlugin(global) else Util.hasModule(lib+module,false)?
      Util.error( 'Util.verifyLoadModules() Missing Module', lib+module+'.js', {global:global} ) if not has
      ok &= has
    ok

  # Load libraries With YepNope
  @loadInitLibs:( root, paths, libs, callback, dbg=false ) ->
    Util.root  = root
    Util.paths = paths
    Util.libs  = libs
    return if not Util.hasGlobal('yepnope')
    deps   = []
    for path, dir of libs.paths
      for mod in libs[path]
        deps.push( root + dir + mod + '.js' )
        Util.log(  root + dir + mod + '.js' ) if dbg
    yepnope( [{ load:deps, complete:callback }] )
    return

  @loadModules:( path, dir, modules, callback=null ) ->
    return if not Util.hasGlobal('yepnope')
    modulesCallback = if callback? then callback  else () => Util.verifyLoadModules(dir,modules)
    deps = []
    for module in modules
      if not Util.hasModule( dir+module, false )
        deps.push( Util.root + path+dir+module+'.js' )
      else
        Util.warn( 'Util.loadModules() already loaded module', Util.root + dir + module )
    yepnope( [{ load:deps, complete:modulesCallback }] )
    return

  @loadModule:( path, dir, module, global=undefined ) ->
    return if not Util.hasGlobal('yepnope')
    modulesCallback = if callback? then callback  else () => Util.verifyLoadModules(dir,[module],global)
    if ( global? and not Util.hasGlobal(global,false) ) or not Util.hasModule( dir+module, false )
      yepnope( [{ load:Util.root+path+dir+module+'.js', complete:modulesCallback }] )
    else
      Util.warn( 'Util.loadModule() already loaded module', dir+module )
    return

  # First add module the modules associative array. Next true try an RequireJS/AMD define().
  # Otherwise if CommonJS exports and module have been supplied attached our module to them
  # Export is capitalized to avoid conflict with "export" JavaScript keyword
  @Export:( module, path, dbg=false ) ->
    Util.setModule( module, path )
    define( path, () -> module ) if define?
    Util.dbg( 'Util.Export', path ) if dbg
    module

  # First lookup module from modules associative array
  # Otherwise try require (RequireJS)
  # Import is capitalized to avoid conflict with "import" JavaScript keyword
  @Import:( path ) ->
    module = Util.getModule( path )
    if not module? and Util.hasRequireJS()
      module = requirejs(  path )
      Util.Export( module, path )
    module

  @IdExt:( path ) ->
    module = Util.Import( path )
    ext = ''
    if not module?.ext?
      Util.error('Util.IdExt() id extension ext not defined for module with path', path )
      ext = module.ext
    else
      ext = path.split('/').pop()
    ext

  @hasRequireJS:() ->
    require? and requirejs?

  @define:( path, module ) -> Util.Export( module, path )

  #window.require = Util.Import if not Util.hasRequireJS() # OK for now, possibe confusion for 3rd party libs in the future
  #window.define  = Util.define if not Util.hasRequireJS() # Playing with fire like with D3

  @setModule:( module, path ) ->
    if not module? and path?
      Util.error('Util.setModule() module not defined for path', path )
    else if module? and not path?
      Util.error('Util.setModule() path not  defined for module', module.toString() )
    else
      Util.modules[path] = module
    return

  @getModule:( path, dbg=false ) ->
    Util.dbg( 'getNodule', path ) if dbg
    module = Util.modules[path]
    if not module?
      Util.error('Util.getModule() module not defined for path', path )
    module

  @setInstance:( instance, path ) ->
    Util.log( 'Util.setInstance()', path )
    if not instance? and path?
      Util.error('Util.setInstance() instance not defined for path', path )
    else if instance? and not path?
      Util.error('Util.setInstance() path not defined for instance', instance.toString() )
    else
      Util.instances[path] = instance
    return

  @getInstance:( path, dbg=false ) ->
    Util.log( 'getInstance', path ) if dbg
    instance = Util.instances[path]
    if not instance?
      Util.error('Util.getInstance() instance not defined for path', path )
    instance

  # ---- Logging -------

  # args should be the argument passed by the original calling function
  @toStrArgs:( prefix, args ) ->
    Util.logStackNum = 0
    str = if Util.isStr(prefix) then prefix + " "  else ""
    for arg in args
      str += Util.toStr(arg) + " "
    str

  @toStr:( arg ) ->
    Util.logStackNum++
    return '' if Util.logStackNum > Util.logStackMax
    switch typeof(arg)
      when 'null'   then 'null'
      when 'string' then Util.toStrStr(arg)
      when 'number' then arg
      when 'object' then Util.toStrObj(arg)
      else arg

  # Recusively stringify arrays and objects
  @toStrObj:( arg ) ->
    str = ""
    if not arg?
      str += "null"
    else if Util.isArray(arg)
      str += "[ "
      for a in arg
        str += Util.toStr(a) + ","
      str = str.substr(0, str.length - 1) + " ]"
    else if Util.isObjEmpty(arg)
      str += "{}"
    else
      str += "{ "
      for prop of arg
        str += '\n' if typeof(arg[prop]) is 'object'
        str += prop + ":"   + Util.toStr(arg[prop]) + ", "  if arg.hasOwnProperty(prop)
      str = str.substr(0, str.length - 2) + " }" # Removes last comma
    str

  @toStrStr:( arg ) ->
    if arg.length > 0 then arg
    else '""'

  # Log arguments through console if it exists
  @dbgFiltersObj:( obj ) ->
    return if not Util.debug
    str = ""
    if obj['dbgFilters']?
      if Util.isArray(obj['dbgFilters']) && obj['dbgFilters'][0] != '*'
        for prop of obj
          #Util.log( prop, obj['dbgFilters'].indexOf(prop), prop != 'dbgFilters' and obj['dbgFilters']?.indexOf(prop) == -1 )
          if prop != 'dbgFilters' and obj['dbgFilters'].indexOf(prop) == -1 and obj.hasOwnProperty(prop)
            str += '\n' if typeof(arg[prop]) is 'object'
            str += prop + ":" + Util.toStr(obj[prop]) + ", "
        str = str.substr(0, str.length - 2 )
        Util.log( str )
    else
      Util.log( obj )
    return

  # Consume unused but mandated variable to pass code inspections
  @noop:() ->
    Util.log( arguments ) if false
    return

  # Conditional log arguments through console
  @dbg:() ->
    return if not Util.debug
    str = ""
    for i in [0...arguments.length]
      str += Util.toStr(arguments[i]) + " "
    Util.consoleLog( str )
    #@gritter( { title:'Debug', time:2000 }, str )
    return

  # Log Error and arguments through console and Gritter
  @error:() ->
    str  = Util.toStrArgs( 'Error:', arguments )
    Util.consoleLog( str )
    @gritter( { title:'Error', sticky:true }, str ) if window['$']? and $['gritter']?
    Util.trace( 'Trace:' )
    return

  # Log Warning and arguments through console and Gritter
  @warn:() ->
    str  = Util.toStrArgs( 'Warning:', arguments )
    Util.consoleLog( str )
    # @gritter( { title:'Warning', sticky:true }, str ) if window['$']? and $['gritter']?
    return

  @toError:() ->
    str = Util.toStrArgs( 'Error:', arguments )
    new Error( str )

  # Log arguments through console if it exists
  @log:() ->
    str = Util.toStrArgs( '', arguments )
    Util.consoleLog( str )
    #@gritter( { title:'Log', time:2000 }, str )
    return

  # Log arguments through gritter if it exists
  @called:() ->
    str = Util.toStrArgs( '', arguments )
    Util.consoleLog( str )
    @gritter( { title:'Called', time:2000 }, str )
    return

  @gritter:( opts, args... ) ->
    return if not ( Util.hasGlobal('$',false)  and $['gritter']? )
    str = Util.toStrArgs( '', args )
    opts.title = if opts.title? then opts.title else 'Gritter'
    opts.text  = str
    $.gritter.add( opts )
    return

  @consoleLog:( str ) ->
    console.log(str) if console?
    return

  @trace:(  ) ->
    str = Util.toStrArgs( 'Trace:', arguments )
    try
      throw new Error( str )
    catch error
      Util.log( error.stack )
    return

  @alert:(  ) ->
    str = Util.toStrArgs( '', arguments )
    Util.consoleLog( str )
    alert( str )
    return

  # Does not work
  @logJSON:(json) ->
    Util.consoleLog(json)

  # ------ Validators ------

  @isDef:(d)         ->  d?
  @isStr:(s)         ->  s? and typeof(s)=="string" and s.length > 0
  @isNum:(n)         ->  n? and typeof(n)=="number"
  @isObj:(o)         ->  o? and typeof(o)=="object"
  @isObjEmpty:(o)    ->  Util.isObj(o) and Object.getOwnPropertyNames(o).length is 0
  @isFunc:(f)        ->  f? and typeof(f)=="function"
  @isArray:(a)       ->  a? and typeof(a)!="string" and a.length? and a.length > 0
  @isEvent:(e)       ->  e? and e.target?
  @inIndex:(a,i)     ->  Util.isArray(a) and 0 <= i and i < a.length
  @inArray:(a,e)     ->  Util.isArray(a) and a.indexOf(e) > -1
  @atLength:(a,n)    ->  Util.isArray(a) and a.length==n
  @head:(a)          ->  if Util.isArray(a) then a[0]          else null
  @tail:(a)          ->  if Util.isArray(a) then a[a.length-1] else null
  @time:()           ->  new Date().getTime()
  @isStrInteger:(s)  -> /^\s*(\+|-)?\d+\s*$/.test(s)
  @isStrFloat:(s)    -> /^\s*(\+|-)?((\d+(\.\d+)?)|(\.\d+))\s*$/.test(s)
  @isStrCurrency:(s) -> /^\s*(\+|-)?((\d+(\.\d\d)?)|(\.\d\d))\s*$/.test(s)
  #@isStrEmail:(s)   -> /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/.test(s)

  # ----------------- Guarded jQuery dependent calls -----------------

  @resize:( callback ) ->
    window.onresize = () ->
      setTimeout( callback, 100 )
    return

  @resizeTimeout:( callback, timeout = null ) ->
    window.onresize = () ->
      clearTimeout( timeout ) if timeout?
      timeout = setTimeout( callback, 100 )
    return

  @show:( id, hide ) ->
    $id = $('#'+id)
    return $id if not Util.hasGlobal('$')
    if hide? then $(hide).hide()
    $id.show()
    $id

  @needsContent:( id, hide ) ->
    return false if not Util.hasGlobal('$')
    $id = Util.show( id, hide )
    Util.isEmpty( $id )

  @isEmpty:( $elem ) ->
    if Util.hasGlobal('$')
      $elem.length == 0 || $elem.children().length == 0
    else
      false

  @isJQuery:( $e ) ->
    Util.hasGlobal('$') and $e? and ( $e instanceof $ || 'jquery' in Object($e) ) and $e.length > 0

  # ------ Converters ------

  @extend:( obj, mixin ) ->
    for own name, method of mixin
      obj[name] = method
    obj

  @include:( klass, mixin ) ->
    Util.extend( klass.prototype, mixin )

  @toEvent:( e ) ->
    errorCode = if e.target? and e.target.errorCode then e.target.errorCode
    { errorCode:errorCode }

  @indent:(n) ->
    str = ''
    for i in [0...n]
      str += ' '
    str

  @hashCode:( str ) ->
    hash = 0
    for i in [0...str.length]
      hash = (hash<<5) - hash + str.charCodeAt(i)
    hash

  @lastTok:( str, delim ) ->
    str.split(delim).pop()

  @firstTok:( str, delim ) ->
    if Util.isStr(str) and str.split?
      str.split(delim)[0]
    else
      Util.error( "Util.firstTok() str is not at string", str )
      ''

  @isDefs:() ->
    for arg in arguments
      if not arg?
        return false
    true

  ###
    parse = document.createElement('a')
    parse.href =  "http://example.com:3000/dir1/dir2/file.ext?search=test#hash"
    parse.protocol  "http:"
    parse.hostname  "example.com"
    parse.port      "3000"
    parse.pathname  "/dir1/dir2/file.ext"
    parse.segments  ['dir1','dir2','file.ext']
    parse.filex     ['file','ext']
    parse.file       'file'
    parse.ext        'ext'
    parse.search    "?search=test"
    parse.hash      "#hash"
    parse.host      "example.com:3000"
  ###

  @parseURI:( url ) ->
    parse          = document.createElement('a')
    parse.href     = url
    parse.segments = parse.pathname.split('/')
    parse.filex    = parse.segments.pop().split('.')
    parse.file     = parse.filex[0]
    parse.ext      = if parse.filex.length==2 then parse.filex[1] else ''
    parse

  @quicksort:( array ) ->
    return [] if array.length == 0
    head = array.pop()
    small = ( a for a in array when a <= head )
    large = ( a for a in array when a >  head )
    (Util.quicksort(small)).concat([head]).concat( Util.quicksort(large) )

  # Return and ISO formated data string
  @isoDateString:( date ) ->
    pad = (n) -> if n < 10 then '0'+n else n
    date.getUTCFullYear()  +'-'+pad(date.getUTCMonth()+1)+'-'+pad(date.getUTCDate())+'T'+
    pad(date.getUTCHours())+':'+pad(date.getUTCMinutes())+':'+pad(date.getUTCSeconds())+'Z'

  # Generate four random hex digits
  @hex4:() ->
    (((1+Math.random())*0x10000)|0).toString(16).substring(1)

  # Generate a 32 bits hex
  @hex32:() ->
    hex = @hex4()
    for i in [1..4]
      Util.noop(i)
      hex += @hex4()
    hex

  # Return a number with fixed decimal places
  @toFixed:( arg, dec=2 ) ->
    num = switch typeof(arg)
      when 'number' then arg
      when 'string' then parseFloat(arg)
      else 0
    num.toFixed(dec)

  @toCap:( str ) -> str.charAt(0).toUpperCase() + str.substring(1)
  @unCap:( str ) -> str.charAt(0).toLowerCase() + str.substring(1)

  # Beautiful Code, Chapter 1.
  # Implements a regular expression matcher that supports character matches,
  # '.', '^', '$', and '*'.

  # Search for the regexp anywhere in the text.
  @match:(regexp, text) ->
    return Util.match_here(regexp.slice(1), text) if regexp[0] is '^'
    while text
      return true if Util.match_here(regexp, text)
      text = text.slice(1)
    false

  # Search for the regexp at the beginning of the text.
  @match_here:(regexp, text) ->
    [cur, next] = [regexp[0], regexp[1]]
    if regexp.length is 0 then return true
    if next is '*' then return Util.match_star(cur, regexp.slice(2), text)
    if cur is '$' and not next then return text.length is 0
    if text and (cur is '.' or cur is text[0]) then return Util.match_here(regexp.slice(1), text.slice(1))
    false

  # Search for a kleene star match at the beginning of the text.
  @match_star:(c, regexp, text) ->
    loop
      return true if Util.match_here(regexp, text)
      return false unless text and (text[0] is c or c is '.')
      text = text.slice(1)

  @match_test:() ->
    Util.log( Util.match_args("ex", "some text") )
    Util.log( Util.match_args("s..t", "spit") )
    Util.log( Util.match_args("^..t", "buttercup") )
    Util.log( Util.match_args("i..$", "cherries") )
    Util.log( Util.match_args("o*m", "vrooooommm!") )
    Util.log( Util.match_args("^hel*o$", "hellllllo") )

  @match_args:( regexp, text ) ->
    Util.log( regexp, text, Util.match(regexp,text) )

# Export Util here at the end (important as a convenience
# Not really needed since Util is a global
Util.Export( Util, 'mod/Util' )
