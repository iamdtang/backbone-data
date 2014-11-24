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
			model: Person
		});

		DS.defineResource({
			name: 'person',
			idAttribute: 'id',
			model: Person,
			collection: PersonCollection
		});

		people = [
			{ id: 1, name: 'John', age: 54 },
			{ id: 2, name: 'Jane', age: 24 },
			{ id: 3, name: 'Matt', age: 34 }
		];
	});

	afterEach(function() {
		DS.ejectAll('person');
		DS.reset();
	});

	it('should not make a request for the model if it is already in the store', function() {
		DS.inject('person', people);
		var stub = sinon.stub(Backbone.Model.prototype, 'fetch');
		DS.find('person', 2).then(function(model) {
			expect(model.toJSON()).to.eql({ id: 2, name: 'Jane', age: 24 });
		});

		expect(stub.callCount).to.equal(0);
		Backbone.Model.prototype.fetch.restore();
	});

	it('should store a model in the store when it has fetched it successfully', function(done) {
		var server = sinon.fakeServer.create();
		server.respondWith("GET", "/people/12345",
	        [200, { "Content-Type": "application/json" },
	         '{ "id": 12345, "name": "Gwen" }']);

		DS.find('person', 12345).done(function() {
			expect(DS.get('person', 12345).toJSON()).to.eql({ "id": 12345, "name": "Gwen" });
			done();	
		});

		server.respond();
		server.restore();
	});
});