
Store = Util.Import( 'store/Store' )

class Firebase extends Store

  Util.loadModule( Util.paths.bower, 'firebase/', 'firebase', 'Firebase' )
  Store.Firebase = Firebase
  Util.Export( Store.Firebase, 'store/Store.Firebase' )

  FireBaseURL      = 'axiom6.firebaseIO.com'
  FireBasePassword = 'Athena66' # I know this is stupid

  constructor:( uri, key ) ->
    super( uri, key )
    @fb        = @openFireBase( uri )

  add:( t, id, object  )    ->
    subject = @createSubject()
    onComplete = (error) =>
      if not error?
        @success( { op:'add', id:id, obj:object }, subject )
      else
        @onerror( { op:'add', id:id, obj:object, error:error },  subject )
    @fb.child(t+'/'+id).set( object, onComplete )
    subject

  get:( t, id ) ->
    subject = @createSubject()
    @fb.child(t+'/'+id).once('value', (snapshot) =>
      if snapshot.val()?
        @success( { op:'get', id:id, obj:snapshot.val() }, subject )
      else
        @onerror( { op:'get', id:id, text:'Firebase get error' }, subject ) )
    subject

  put:( t, id,  object ) ->
    subject = @createSubject()
    onComplete = (error) =>
      if not error?
        @success( { op:'put', id:id, obj:object }, subject )
      else
        @onerror( { op:'put', id:id, obj:object, error:error },  subject )
    @fb.child(t+'/'+id).update( object, onComplete )
    subject

  del:( t, id ) ->
    subject = @createSubject()
    onComplete = (error) =>
      if not error?
        @success( { op:'del', id:id }, subject )
      else
        @onerror( { op:'del', id:id, error:error },  subject )
    @fb.child(t).remove( id, onComplete )
    subject

  insert:( t, objectsIn ) ->
    subject = @createSubject()
    missing = []
    if Util.isArray(objects)
      objects = {}
      for object in objectsIn
        key = [object[@key]]
        if key? then objects[key] = object else missing.push( object )
    else
      objects = objects
    onComplete = (error) =>
      if not error?
        @success( { op:'insert', table:t, objects:objects, missing:missing, }, subject )
      else
        @onerror( { op:'insert', table:t, objects:objects, missing:missing, error:error },  subject )
    @fb.child(t).set( objects, onComplete )
    subject

  select:( t, where=Store.where, toArray=false ) ->
    subject = @createSubject()
    @fb.child(t).once('value', (snapshot) =>
      if snapshot.val()?
        objects = @toObjects( snapshot.val(), where, toArray )
        @success( { op:'select', table:t, objects:objects, where:where.toString() }, subject )
      else
        @onerror( { op:'select', table:t, where:where.toString() } ) )
    subject

  update:( t, objectsIn ) ->
    subject = @createSubject()
    missing = []
    if Util.isArray(objects)
      objects = {}
      for object in objectsIn
        key = [object[@key]]
        if key? then objects[key] = object else missing.push( object )
    else
      objects = objects
    onComplete = (error) =>
      if not error?
        @success( { op:'update', table:t, objects:objects, missing:missing, }, subject )
      else
        @onerror( { op:'update', table:t, objects:objects, missing:missing, error:error },  subject )
    @fb.child(t).update( objects, onComplete )
    subject

  remove:( t, where=Store.where ) ->
    subject = @createSubject()
    @fb.child(t).once('value', (snapshot) =>
      if snapshot.val()?
        objects = @toObjects( snapshot.val(), where, false )
        for key, object of objects when where(val)
          @fb.child(t).remove( key ) # Need to see if onComplete is needed
        @success( { op:'select', table:t, objects:objects, where:where.toString() }, subject )
      else
        @onerror( { op:'select', table:t, where:where.toString() } ) )
    subject

  create:( t, schema ) ->
    subject = @createSubject()
    onComplete = (error) =>
      if not error?
        @success( { op:'create', table:t, schema:schema }, subject )
      else
        @onerror( { op:'create', table:t, error:error   }, subject )
    fb.set( t, onComplete )
    subject

  # Need to show a table schema for one table t
  show:( t ) ->
    subject = @createSubject()
    tables  = []
    @fb.once('value', (snapshot) =>
      snapshot.forEach( (table) =>
        tables.push( table.key() )
      @success( { op:'show', table:t, tables:tables }, subject ) ) )
    subject

  alter:( t, alters ) ->
    subject = @createSubject()
    @success( { op:'alter',  table:t, alters:alters  }, subject  )

  drop:( t ) ->
    subject = @createSubject()
    onComplete = (error) =>
      if not error?
        @success( { op:'drop', table:t }, subject )
      else
        @onerror( { op:'drop', table:t, error:error }, subject )
    @fb.revove( t, onComplete )
    subject

  subscribe:( t, id ) ->
    subject = @createSubject()
    path    = if id eq '' then t else t+'/'+id
    onEvt   = 'value'
    @fb.child(path).on( onEvt, (snapshot) =>
      key = snapshot.name()
      val = snapshot.val()
      if key? and val?
        @success( { op:'subscribe', table:t, id:id, key:name, object:val } )
      else if not val?
        @success( { op:'subscribe', table:t, id:id, key:name  } )
      else
        @onerror( { op:'subscribe', table:t, id:id  } ) )
    subject

  isNotEvt:( evt ) ->
    switch evt
      when 'value','child_added','child_changed','child_removed','child_moved' then false
      else                                                                          true


  auth:( tok ) ->
    subject = @createSubject()
    @fb.auth( tok,  ( error, result ) =>
      if not error?
        @success( { op:'auth', auth:result.auth, expires:new Date(result.expires * 1000) } )
      else
        @onerror( { op:'auth', tok:tok, error:error } ) )
    subject
