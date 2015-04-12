
class Store

  Util.dependsOn('Rx','$')
  Util.Export( Store, 'store/Store' )
  Store.modules = ['Store.Memory','Store.IndexedDB','Store.Rest','Store.Firebase','Store.PouchDB']
  Util.loadModules( 'src/', 'store/', Store.modules )

  # CRUD           Create      Retrieve  Update    Delete
  @restOps  = [ 'add',      'get',    'put',    'del'    ]
  @sqlOps   = [ 'insert',   'select', 'update', 'remove' ]
  @tableOps = [ 'create',   'show',   'alter',  'drop'   ]

  @isRestOp:(  op ) -> Store. restOps.indexOf(op) isnt -1
  @isSqlOp:(   op ) -> Store.  sqlOps.indexOf(op) isnt -1
  @isTableOp:( op ) -> Store.tableOps.indexOf(op) isnt -1

  @methods = Store.restOps.concat( Store.sqlOps ).concat( Store.tableOps ).concat(['subscribe'])

  # Dafaults for empty arguments
  @where  = (value) -> true # Default where clause filter that returns true to access all records
  @schema = {}              # Default schema
  @alters = {}              # Default schema alterations

  # @uri     = REST URI where the file part is the database
  # @key    = The key id property = default is ['id']
  constructor:( @uri, @key ) ->
    @database  = Util.parseURI( @uri ).file

  ready:() -> Util.noop()

  # REST Api  CRUD + Subscribe for objectect records
  add:( table, id, object )  -> Util.noop(  table, id, object )  # Post    Create   an object into table with id
  get:( table, id )          -> Util.noop(  table, id  )         # Get     Retrieve an object from table with id
  put:( table, id, object )  -> Util.noop(  table, id, object )  # Put     Update   an object into table with id
  del:( table, id )          -> Util.noop(  table, id )          # Delete  Delete   an object from table with id

  # SQL Table DML (Data Manipulation Language) with multiple objects (rows)
  insert:( table, objects           ) -> Util.noop( table, objects  )  # Insert objects into table with unique id
  select:( table, where=Store.where ) -> Util.noop( table, where    )  # Select objects from table with where clause
  update:( table, objects           ) -> Util.noop( table, objects  )  # Update objects into table mapped by id
  remove:( table, where=Store.where ) -> Util.noop( table, where    )  # Delete objects from table with where clause

  # Table DDL (Data Definition Language)
  create:( table, schema=Store.schema ) -> Util.noop( table, schema ) # Create a table with an optional schema
  show:(   table=''                   ) -> Util.noop( table         ) # Show a table or a list tables if table name blank
  alter:(  table, alters=Store.alters ) -> Util.noop( table, alters ) # Alter a table's schema - especially columns
  drop:(   table                      ) -> Util.noop( table         ) # Drop the entire @table - good for testing

  # Subscribe to CRUD changes on a table or an object with id
  subscribe:( table, id='' ) -> Util.noop( table, id )

  createSubject:( subject=null ) ->
    if subject? then subject else new Rx.AsyncSubject()

  success:( result, subject ) ->
    result.uri      = @uri
    result.database = @database
    result.key      = @key
    subject.onNext( result )
    return

  onerror:( result, subject ) ->
    result.uri      = @uri
    result.database = @database
    result.key      = @key
    subject.onError( result )
    return

  toArray:( objects, _deleted = false ) ->
    array = []
    isArray = Util.isArray(objects)
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
    if Util.isArray(rows)
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

