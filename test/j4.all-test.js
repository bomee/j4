var assert = chai.assert;
describe('j4 Test', function() {
  describe('template Test', function() {
    it('无特殊指令', function(){
      assert.equal('<div>j4 template engine.</div>', j4.template('<div>j4 template engine.</div>').render());
    });

    it('基本测试', function(){
      assert.equal(new Array(4).join('<div>j4</div>'), j4.template('<%for(var i = 0; i < 3; i++)%><div>j4</div>').render());

      var t = j4.template('<div>name:<%=name%>, age:<%=age%></div>');
      assert.equal('<div>name:, age:</div>', t.render({name:null,age:null}));
    });
  });
  return;

  describe('cookie Test', function() {
    it('不设置过期时间', function(){
      j4.cookie.set('sessionCookie', 'sessionCookieValue');
      assert.equal('sessionCookieValue', j4.cookie.get('sessionCookie'));
    });
    it('设置值类型为Object', function(){
      j4.cookie.set('name', {first:'xiaobo', last:'yu'});
      assert.deepEqual({first:'xiaobo', last:'yu'}, j4.cookie.get('name'));
    });
    it('测试值过期', function(done){
      j4.cookie.set('name', 'bomee', 10);
      this.timeout(20000);
      window.setTimeout(function(){
        assert.equal(null, j4.cookie.get('name'));
        done();
      }, 15000);
      assert.equal('bomee', j4.cookie.get('name'));
    });

    it('清空cookie', function(){
      j4.cookie.set('cookie_name', 'cookie_value');
      assert.equal('cookie_value', j4.cookie.get('cookie_name'));
      j4.cookie.remove('cookie_name');
      assert.equal(null, j4.cookie.get('cookie_name'));
    });

  });
  
  describe('util Test', function() {
    it('#isArray()',function(){
      assert(j4.isArray([]));
      assert(j4.isArray(new Array()));
      assert(!j4.isArray(null));
      assert(!j4.isArray());
      assert(!j4.isArray('string'));
    });
    
    it('#isString()',function(){
      assert(!j4.isString([]));
      assert(!j4.isString({}));
      assert(!j4.isString(null));
      assert(!j4.isString());
      assert(j4.isString('string'));
    });
    
    it('#isFunction()',function(){
      assert(!j4.isFunction([]));
      assert(!j4.isFunction({}));
      assert(!j4.isFunction(null));
      assert(!j4.isFunction());
      assert(!j4.isFunction('string'));
      assert(j4.isFunction(function(){}));
    });
    
    it('#format()',function(){
      assert.equal('<p>format</p>', j4.format('<p>{0}</p>', 'format'));
      assert.equal('<p>format1,format2</p>', j4.format('<p>{0},{1}</p>', 'format1', 'format2'));
      assert.equal('<p>bomee,20</p>', j4.format('<p>{name},{age}</p>', {name:'bomee', age:20}));
      assert.equal('<p>bomee,30</p>', j4.format('<p>{name},{1.age}</p>', {name:'bomee', age:20}, {name:'caowei', age:30}));
      assert.equal('<p>bomee,20.00</p>', j4.format('<p>{name},{age:f2}</p>', {name:'bomee', age:20}));
      assert.equal('<p>bomee,50</p>', j4.format('<p>{name},{weight:d}</p>', {name:'bomee', weight: 49.55}));
      assert.equal('<p>25%</p>', j4.format('<p>{0:p}</p>', 0.25));
      assert.equal('<p>25.00%</p>', j4.format('<p>{0:p2}</p>', 0.25));
      assert.equal('<p>0.25</p>', j4.format('<p>{0:C2}</p>', 0.25));
      assert.equal('<p>100.25</p>', j4.format('<p>{0:C2}</p>', 100.25));
      assert.equal('<p>250</p>', j4.format('<p>{0:C}</p>', 250));
      assert.equal('<p>2,500</p>', j4.format('<p>{0:C}</p>', 2500));
      assert.equal('<p>2,500,000</p>', j4.format('<p>{0:C}</p>', 2500000));
      assert.equal('<p>-250,000,000</p>', j4.format('<p>{0:C}</p>', -250000000));
      assert.equal('<p>2,500,000.00</p>', j4.format('<p>{0:C2}</p>', 2500000));
      
      assert.equal('<p>format</p>', j4.format('<p>{0.a.b}</p>', {a:{b:'format'}}));
      assert.equal('<p>25.00%</p>', j4.format('<p>{0.a.b:p2}</p>', {a:{b: 0.25}}));
      
      assert.equal('<p>format1,format2</p>', j4.format('<p>{0},{1}</p>', ['format1', 'format2']));
      
      assert.equal('<p>format1,format2</p>', j4.format('<p>{0},{1.1}</p>', 'format1', ['format1', 'format2']));
      assert.equal('<p>format1,25.00%</p>', j4.format('<p>{0},{1.1:p2}</p>', 'format1', ['format1', 0.25]));
    });
  });
});