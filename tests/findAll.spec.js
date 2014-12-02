describe('find()', function() {
	var people;
	var Person;
	var PersonCollection;

	beforeEach(function() {
		Person = Backbone.Model.extend({
			url: function() {
				return '/people/' + this.get('id')
			}
		});

		PersonCollection = Backbone.Collection.extend({
			model: Person,
			url: '/people'
		});

		DS.defineResource({
			name: 'person',
			idAttribute: 'id',
			model: Person,
			collection: PersonCollection
		});
	});

	afterEach(function() {
		DS.ejectAll('person');
		DS.reset();
	});

	it('should make an http request for data and put items in the store', function(done) {
		var server = sinon.fakeServer.create();
		server.respondWith("GET", "/people",
	        [200, { "Content-Type": "application/json" },
	         '[{ "id": 33, "name": "Gwen", "age": 43 }]']);

		DS.findAll('person').done(function(collection) {
			expect(collection).to.equal(DS.getAll('person'));
			expect(DS.getAll('person').toJSON()).to.eql([
				{ id: 33, name: "Gwen", age: 43 }
			]);

			expect(collection).to.equal(DS.getAll('person'));

			done();	
		});

		server.respond();
		server.restore();
	});

	it('should allow you to specify if models fetched are incomplete', function(done) {
		var spy = sinon.spy(Backbone.Model.prototype, 'fetch');
		var server = sinon.fakeServer.create();

		server.respondWith("GET", "/people",
	        [200, { "Content-Type": "application/json" },
	         '[{ "id": 33, "name": "Gwen", "age": 43 }]']);

		server.respondWith("GET", "/people/33",
	        [200, { "Content-Type": "application/json" },
	         '{ "id": 33, "name": "Gwen", "age": 43, "gender": "F"  }']);

		DS.findAll('person', { incomplete: true }).done(function(collection) {
			DS.find('person', 33).done(function(model) {
				expect(model.toJSON()).to.eql({ "id": 33, "name": "Gwen", "age": 43, "gender": "F" });
				DS.find('person', 33).done(function(model) {
					expect(spy.callCount).to.equal(1);
					done();
				});
			});
		});

		server.respond();
		server.respond();
		server.restore();
	});
});