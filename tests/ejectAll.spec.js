describe('ejectAll()', function() {
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
	});

	afterEach(function() {
		DS.reset();
	});

	it('should eject all models from a collection but keep the collection', function() {
		DS.inject('person', [
			{ id: 1, name: 'John', age: 54 },
			{ id: 2, name: 'Jane', age: 24 },
			{ id: 3, name: 'Matt', age: 34 }
		]);

		var collection1 = DS.getAll('person');
		DS.ejectAll('person');
		expect(DS.getAll('person').length).to.equal(0);
		expect(DS.getAll('person')).to.equal(collection1);
	});
});