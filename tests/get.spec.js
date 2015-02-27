describe('get()', function() {
	var people;
	var Person;

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

	it('should return the same object if already in the store', function() {
		DS.inject('person', people);
		expect(DS.get('person', 2)).to.equal(DS.get('person', 2));
		expect(DS.get('person', 2).toJSON()).to.eql({ id: 2, name: 'Jane', age: 24 });
	});

	it('should return null if the object doesnt exist in the store', function() {
		expect(DS.get('person', 999)).to.be.null;
	});

	it('should return a single model without the PK if the resource is registered without a collection', function() {
		var UserProfile = Backbone.Model.extend();

		DS.defineResource({
			name: 'profile',
			model: UserProfile
		});

		DS.inject('profile', {
			first: 'David',
			last: 'Tang'
		});

		expect(DS.get('profile').toJSON()).to.eql({
			first: 'David',
			last: 'Tang'
		});
	});

	it('should return the same model resource every time', function() {
		var UserProfile = Backbone.Model.extend();

		DS.defineResource({
			name: 'profile',
			model: UserProfile
		});

		expect(DS.get('profile')).to.equal(DS.get('profile'));
	});

	it('should return an object', function() {
		var UserProfile = Backbone.Model.extend();

		DS.defineResource({
			name: 'profile',
			model: UserProfile
		});

		expect(typeof DS.get('profile')).to.equal('object');
	});
});