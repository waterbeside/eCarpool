// import config from '../configs'
let uid = localStorage.getItem('CP_uid');
var cModel = {
    config:{
      serverName : 'carpool_u'+ uid,
      version: 1
    },
    supports: function(){
      var indexedDB       = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || null;
      //prefixes of window.IDB objects
      var IDBTransaction  = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
      var IDBKeyRange     = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange
      if (!indexedDB) {
        alert("Your browser doesn't support a stable version of IndexedDB.")
      }
      return {indexedDB:indexedDB, IDBTransaction:IDBTransaction, IDBKeyRange:IDBKeyRange}
    },
    //取得库
    getObjectStore: function (server,mode) {
        var txn, store;
        mode = mode || 'readonly';
        txn = server.transaction(server.objectStoreNames[0], mode);
        store = txn.objectStore(server.objectStoreNames[0]);
        return store;
    },
    //清空库
    clear:function(server){
      var store = this.getObjectStore(server,'readwrite');
      store.clear();
    },
    //错误处理
    errorHandler: function (error) {
      console.log('error'+ error.target.code)
        // window.alert('error: ' + error.target.code);
        debugger;
    },

    //数据排序
    sortByKey:function(array, key, sortType) {
      sortType = sortType.toLowerCase() || 'asc'
      return array.sort(function(a, b) {
          var x = a[key]; var y = b[key];
          if(sortType==='desc'){
            return ((x < y) ? 1 : ((x > y) ? -1 : 0));
          }else{
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
          }

      });
    },

    myAddress : function(action,options){
      var that            = this;
      var supports        = that.supports();
      var indexedDB       = supports['indexedDB'];
      var request         = indexedDB.open(that.config.serverName, that.config.version);
      // console.log(request)

      request.onerror     = function(e){
        console.log('OPen Error!');
      };
      request.onupgradeneeded = function(e){
          var server = e.target.result;
          var store = server.createObjectStore('my_address', {keyPath: 'addressid', autoIncrement: true});
          store.createIndex("listorder", "listorder", { unique: false });
          store.createIndex("address_type", "address_type", { unique: false });
          store.createIndex("addressname", "addressname", { unique: false });
          store.createIndex("latitude", "latitude", { unique: false });
          store.createIndex("longtitude", "longtitude", { unique: false });
          store.createIndex("address", "address", { unique: false });
          // console.log('创建对象仓库成功');
      }
      request.onsuccess=function(e){
        var server = e.target.result;
        server.onerror =   cModel.errorHandler;
        function successHandler(e){
          if(typeof(options.success)=='function'){
            options.success(e.target.result,server);
          }
        }
        switch (action) {
          case 'open': //打开
            if(typeof(options.success)=='function'){
              var mode = options.mode || 'readwrite'
              var store = that.getObjectStore(server,mode);
              options.success(store,server);
            }
          break;
          case 'clear': //清空
            that.clear(server);
          break;
          case 'getAll': //取得全部
            var orderByArray = options.orderBy.split(/[ ]+/);
            var sortType = typeof(orderByArray[1])!='undefined' && orderByArray[1].toLowerCase() == 'desc' ? 'desc' : 'asc';
            var store = that.getObjectStore(server);
            if (typeof(store.getAll) != 'function') {
                var cursor = store.openCursor();
                var data = [];
                cursor.onsuccess = function (e) {
                    var result = e.target.result;
                    if (result &&   result !== null) {
                        data.push(result.value);
                        result.continue();
                    } else {
                      var rs = data && data.length>1 ? that.sortByKey(data,'listorder',sortType) : data;
                      if(typeof(options.success)=='function'){
                        options.success(data,server);
                      }
                    }
                };
            }else{
              var rq = store.getAll();
              // alert(rq);
              rq.onsuccess = function(event) {
                var data = event.target.result;
                var rs = data && data.length>1 ? that.sortByKey(data,'listorder',sortType) : data;
                if(typeof(options.success)=='function'){
                  options.success(data,server);
                }
              };
              rq.onerror = function(event){
              }
            }
          break;
          case 'add': //添加
            var store = that.getObjectStore(server,'readwrite');
            if(options.batch){
              for(i=0;i<options.data.length;i++){
                var data = options.data[i];
                var rq = store.add(data);
                rq.onsuccess = successHandler;
              }
            }else{
              var data = options.data;
              var rq = store.add(data);
              rq.onsuccess = successHandler;
            }
            break;
            case 'update': //更新
              var store = that.getObjectStore(server,'readwrite');
              if(options.batch){
                for(i=0;i<options.data.length;i++){
                  var data = options.data[i];
                  var rq = store.put(data);
                  rq.onsuccess = successHandler;
                }
              }else{
                var data = options.data;
                var rq = store.put(data);
                rq.onsuccess = successHandler;
              }
            break;
            case 'only': //根据key最得一条数据
              if(options.data){
                var field = ''
                var val   = ''
                for(var key in options.data){
                  field = key;
                  val   = options.data[key]
                }
              }
              var store = that.getObjectStore(server).index(key);
              var rq = store.get(val);
              // rq.onsuccess = that.successHandler(event,server,options);
              rq.onsuccess = successHandler;
            break;
            case 'get': //根据主键取得一条数据
              var store = that.getObjectStore(server);
              var rq = store.get(options.key);
              rq.onsuccess = successHandler;
            break;

        }

      };

    }

  }

export default cModel;
