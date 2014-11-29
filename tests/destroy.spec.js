describe('destroy()', function() {
	var people;
	var Person;
	var PersonCollection;

	beforeEach(function() {
		Person = Backbone.Model.extend({
			url: function() {
				if (this.get('id')) {
					return '/people/' + this.get('id');	
				}
				
				return '/people';
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

		DS.inject('person', people);
	});

	afterEach(function() {
		DS.ejectAll('person');
		DS.reset();
	});

	it('should make a request to destroy the model and inject it into the store', function(done) {
		var spy = sinon.spy(Backbone.Model.prototype, 'destroy');
		var server = sinon.fakeServer.create();
		var person;

		server.respondWith("DELETE", "/people/3",
	        [200, { "Content-Type": "application/json" },
	         '{ "id": 3, "name": "Matt", "age": 34 }']);

		DS.destroy('person', 3).then(function(model) {
			expect(DS.getAll('person').length).to.equal(2);
			expect(DS.get('person', 3)).to.equal(null);
			done();
		});

		expect(spy.callCount).to.equal(1);
		Backbone.Model.prototype.destroy.restore();

		server.respond();
		server.restore();
	});
});