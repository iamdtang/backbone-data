describe('filter()', function() {
	var people;
	var Person;
	var PersonCollection;

	beforeEach(function() {
		people = [
			{ id: 1, name: 'John', age: 54 },
			{ id: 2, name: 'Jane', age: 24 },
			{ id: 3, name: 'Matt', age: 54 }
		];

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

	it('should proxy to collection.filter() but return a new collection', function() {
		DS.inject('person', people);
		var filteredPeople = DS.filter('person', function(model) {
			return model.get('age') === 54;
		});

		expect(filteredPeople).to.be.an.instanceof(PersonCollection);
		expect(filteredPeople.toJSON()).to.eql([
			{ id: 1, name: 'John', age: 54 },
			{ id: 3, name: 'Matt', age: 54 }
		]);
	});

	it('should return the same models in the store, not create copies of a model', function() {
		DS.inject('person', people);
		var filteredPeople = DS.filter('person', function(model) {
			return model.get('age') === 54;
		});

		expect(filteredPeople.at(1)).to.equal(DS.get('person', 3));
	});
});