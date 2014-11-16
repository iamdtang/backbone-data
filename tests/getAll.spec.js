describe('getAll()', function() {
	var people;
	var Person;
	var PersonCollection;

	beforeEach(function() {
		Person = Backbone.Model.extend();
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
		DS.removeResource('person');
	});

	it('should return a collection of models', function() {
		DS.inject('person', people);
		expect(DS.getAll('person')).to.be.an.instanceof(PersonCollection);
		expect(DS.getAll('person').length).to.equal(3);
	});

	it('should return the same collection of models', function() {
		DS.inject('person', people);

		var collection1 = DS.getAll('person');
		var collection2 = DS.getAll('person');

		expect(collection1).to.equal(collection2);
	});
});