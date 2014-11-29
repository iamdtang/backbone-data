describe('update()', function() {
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

	it('should make a request to update the model in the store', function(done) {
		var spy = sinon.spy(Backbone.Model.prototype, 'save');
		var server = sinon.fakeServer.create();
		var person;

		server.respondWith("PUT", "/people/3",
	        [200, { "Content-Type": "application/json" },
	         '{ "id": 3, "name": "Mathew", "age": 34, "updated_at": 1234 }']);

		DS.update('person', 3, {
			name: 'Mathew'
		}).then(function(model) {
			expect(model).to.equal(DS.get('person', 3));
			expect(DS.get('person', 3).toJSON()).to.eql({ id: 3, name: 'Mathew', age: 34, updated_at: 1234 });
			done();
		});

		expect(spy.callCount).to.equal(1);
		Backbone.Model.prototype.save.restore();

		server.respond();
		server.restore();
	});
});