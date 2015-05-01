describe('findAll()', function() {
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

	it("should work with a collection's parse method defined", function(done) {
		PersonCollection.prototype.parse = function(response) {
				return response.people;
		};

		var server = sinon.fakeServer.create();
		var response = JSON.stringify({
			"people":[
				{ "name": "Vin", "age": 46 },
				{ "name": "Paul", "age": 42 }
			]
		});
		server.respondWith("GET", "/people",
	        [200, { "Content-Type": "application/json" }, response]);

		DS.findAll('person').done(function() {
			expect(DS.getAll('person').toJSON()).to.eql([
				{ "name": "Vin", "age": 46 },
				{ "name": "Paul", "age": 42 }
			]);

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

	it('should pull from cache if fetch() has already been called', function(done) {
		var spy = sinon.spy(Backbone.Collection.prototype, 'fetch');
		var server = sinon.fakeServer.create();
		server.respondWith("GET", "/people",
	        [200, { "Content-Type": "application/json" },
	         '[{ "id": 33, "name": "Gwen", "age": 43 }]']);

		DS.findAll('person').done(function(collection) {
			DS.findAll('person').done(function(collection) {
				expect(spy.callCount).to.equal(1);
				done();
			});
		});

		server.respond();
		server.restore();
	});
});
