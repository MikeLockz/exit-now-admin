

class FireExit

  FireBaseURL      = 'incandescent-inferno-3953.firebaseio.com/'
  FireBasePassword = 'athena66' # I know this is stupid

  constructor:( uri, key ) ->
    super( uri, key )
    @fb        = @openFireBase( uri )

  add:( t, id, object, callback  )    ->
    onComplete = (error) =>
      if not error?
        @success( { op:'add', id:id, obj:object }, callback )
      else
        @onerror( { op:'add', id:id, obj:object, error:error } )
    @fb.child(t+'/'+id).set( object, onComplete )
    return

  get:( t, id, callback ) ->
    @fb.child(t+'/'+id).once('value', (snapshot) =>
      if snapshot.val()?
        @success( { op:'get', id:id, obj:snapshot.val() }, callback )
      else
        @onerror( { op:'get', id:id, text:'Firebase get error' } ) )
    return

  put:( t, id,  object, callback ) ->
    onComplete = (error) =>
      if not error?
        @success( { op:'put', id:id, obj:object }, callback )
      else
        @onerror( { op:'put', id:id, obj:object, error:error } )
    @fb.child(t+'/'+id).update( object, onComplete )
    return

  del:( t, id, callback ) ->
    onComplete = (error) =>
      if not error?
        @success( { op:'del', id:id }, callback )
      else
        @onerror( { op:'del', id:id, error:error } )
    @fb.child(t).remove( id, onComplete )
    return

  insert:( t, objectsIn, callback ) ->
    missing = []
    if @isArray(objects)
      objects = {}
      for object in objectsIn
        key = [object[@key]]
        if key? then objects[key] = object else missing.push( object )
    else
      objects = objects
    onComplete = (error) =>
      if not error?
        @success( { op:'insert', table:t, objects:objects, missing:missing, }, callback )
      else
        @onerror( { op:'insert', table:t, objects:objects, missing:missing, error:error } )
    @fb.child(t).set( objects, onComplete )
    return

  select:( t, callback, where=Store.where, toArray=false ) ->
    @fb.child(t).once('value', (snapshot) =>
      if snapshot.val()?
        objects = @toObjects( snapshot.val(), where, toArray )
        @success( { op:'select', table:t, objects:objects, where:where.toString() }, callback )
      else
        @onerror( { op:'select', table:t, where:where.toString() } ) )
    return

  update:( t, objectsIn, callback ) ->
    missing = []
    if @isArray(objects)
      objects = {}
      for object in objectsIn
        key = [object[@key]]
        if key? then objects[key] = object else missing.push( object )
    else
      objects = objects
    onComplete = (error) =>
      if not error?
        @success( { op:'update', table:t, objects:objects, missing:missing, }, callback )
      else
        @onerror( { op:'update', table:t, objects:objects, missing:missing, error:error } )
    @fb.child(t).update( objects, onComplete )
    return

  remove:( t, callback, where=Store.where ) ->
    @fb.child(t).once('value', (snapshot) =>
      if snapshot.val()?
        objects = @toObjects( snapshot.val(), where, false )
        for key, object of objects when where(val)
          @fb.child(t).remove( key ) # Need to see if onComplete is needed
        @success( { op:'select', table:t, objects:objects, where:where.toString() }, callback )
      else
        @onerror( { op:'select', table:t, where:where.toString() } ) )
    return

  create:( t, schema, callback ) ->
    onComplete = (error) =>
      if not error?
        @success( { op:'create', table:t, schema:schema }, callback )
      else
        @onerror( { op:'create', table:t, error:error   } )
    fb.set( t, onComplete )
    return

  # Need to show a table schema for one table t
  show:( t, callback ) ->
    tables  = []
    @fb.once('value', (snapshot) =>
      snapshot.forEach( (table) =>
        tables.push( table.key() )
        @success( { op:'show', table:t, tables:tables }, callback ) ) )
    return

  alter:( t, alters, callback ) ->
    subject = @createSubject()
    @success( { op:'alter',  table:t, alters:alters  }, callback  )
    return

  drop:( t, callback ) ->
    onComplete = (error) =>
      if not error?
        @success( { op:'drop', table:t }, callback )
      else
        @onerror( { op:'drop', table:t, error:error } )
    @fb.revove( t, onComplete )
    return

  subscribe:( t, id, callback ) ->
    path    = if id eq '' then t else t+'/'+id
    onEvt   = 'value'
    @fb.child(path).on( onEvt, (snapshot) =>
      key = snapshot.name()
      val = snapshot.val()
      if key? and val?
        @success( { op:'subscribe', table:t, id:id, key:name, object:val }, callback )
      else if not val?
        @success( { op:'subscribe', table:t, id:id, key:name  }, callback )
      else
        @onerror( { op:'subscribe', table:t, id:id  } ) )
    return

  isNotEvt:( evt ) ->
    switch evt
      when 'value','child_added','child_changed','child_removed','child_moved' then false
      else                                                                          true

  auth:( tok ) ->
    @fb.auth( tok,  ( error, result ) =>
      if not error?
        @success( { op:'auth', auth:result.auth, expires:new Date(result.expires * 1000) } )
      else
        @onerror( { op:'auth', tok:tok, error:error } ) )
    return

  success:( result, callback ) ->
    result.uri      = @uri
    result.database = @database
    result.key      = @key
    callback() if callback?
    return

  onerror:( result ) ->
    result.uri      = @uri
    result.database = @database
    result.key      = @key
    return

  toArray:( objects, _deleted = false ) ->
    array = []
    isArray = isArray(objects)
    if isArray
      if _deleted
        for object in objects
          object._deleted = true
      array = objects
    else
      for own key, object of objects
        object.id       = key
        object._deleted = true if _deleted
        array.push(object)
    array

  toObjects:( rows, where, toArray=false ) ->
    objects = if toArray then [] else {}
    if @isArray(rows)
      for row in rows
        if toArray
          row[@key] = key
          objects.push(row)
        else
          objects[key] = row
    else
      for key, row of rows when where(object)
        if toArray
          row[@key] = key
          objects.push(row)
        else
          objects[key] = row
    objects


  @isArray:(a) ->
    a? and typeof(a)!="string" and a.length? and a.length > 0