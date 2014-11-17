describe('find()', function() {
	var people;
	var Person;
	var PersonCollection;

	beforeEach(function() {
		Person = Backbone.Model.extend({
			url: 'people'
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
		DS.removeResource('person');
	});

	it('should make a request for a model if it is not in the store', function() {
		var spy = sinon.spy(Backbone.Model.prototype, 'fetch');
		DS.find('person', 88);
		expect(spy.callCount).to.equal(1);
		Backbone.Model.prototype.fetch.restore();
	});

	it('should store a model into the store when it has fetched', function() {

	});

	it('should not make a request if the model is already in the store', function() {
		DS.inject('person', people);
		var spy = sinon.spy(Backbone.Model.prototype, 'fetch');
		DS.find('person', 2).then(function(model) {
			expect(model.toJSON()).to.eql({ id: 2, name: 'Jane', age: 24 });
		});

		expect(spy.callCount).to.equal(0);
		Backbone.Model.prototype.fetch.restore();
	});

});