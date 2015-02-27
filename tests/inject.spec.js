describe('inject()', function() {
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
		DS.reset();
	});

	it('should append an array of models to the collection in the store', function() {
		DS.inject('person', people);
		DS.inject('person', [
			{ id: 4, name: 'Mary', age: 23 }
		]);

		var collection = DS.getAll('person');
		expect(collection.length).to.equal(4);
	});

	it('should append a single model to the collection in the store', function() {
		DS.inject('person', people);
		DS.inject('person', { id: 4, name: 'Mary', age: 23 });

		var collection = DS.getAll('person');
		expect(collection.length).to.equal(4);
	});

	it('should return the models injected into the store', function() {
		var models = DS.inject('person', people);

		expect(models[0].toJSON()).to.eql({ id: 1, name: 'John', age: 54 });
		expect(models[1].toJSON()).to.eql({ id: 2, name: 'Jane', age: 24 });
		expect(models[2].toJSON()).to.eql({ id: 3, name: 'Matt', age: 34 });
	});

	it('should allow a single model to be injected', function() {
		var UserProfile = Backbone.Model.extend();

		DS.defineResource({
			name: 'profile',
			model: UserProfile
		});

		var userProfile = DS.inject('profile', {
			first: 'David',
			last: 'Tang'
		});

		expect(userProfile.toJSON()).to.eql({
			first: 'David',
			last: 'Tang'
		});
	});
});