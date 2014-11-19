describe('createInstance()', function() {
	var Person;
	var PersonCollection;

	beforeEach(function() {
		Person = Backbone.Model.extend();
		PersonCollection = Backbone.Collection.extend({
			model: Person
		});
	});

	afterEach(function() {
		DS.reset();
	});

	it('should allow you to create an instance of a Backbone model', function() {
		DS.defineResource({
			name: 'person',
			idAttribute: 'id',
			model: Person,
			collection: PersonCollection
		});

		var person = DS.createInstance('person');
		expect(person).to.be.an.instanceof(Person);
	});

});