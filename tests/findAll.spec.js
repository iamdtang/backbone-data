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
			expect(DS.getAll('person').toJSON()).to.eql([
				{ id: 33, name: "Gwen", age: 43 }
			]);

			expect(collection).to.equal(DS.getAll('person'));

			done();	
		});

		server.respond();
		server.restore();
	});
});