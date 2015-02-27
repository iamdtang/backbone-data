describe('defineResource()', function() {
	var Person;

	beforeEach(function() {
		Person = Backbone.Model.extend({
			url: function() {
				return '/people/' + this.get('id')
			}
		});
	});

	it('should throw an error if model is not provided', function() {
		expect(function() {
			DS.defineResource({
				name: 'person',
				idAttribute: 'id',
				collection: Backbone.Collection
			});
		}).to.throw(Error);
	});

	it('should throw an error if name is not provided', function() {
		expect(function() {
			DS.defineResource({
				idAttribute: 'id',
				collection: Backbone.Collection,
				model: Backbone.Model
			});
		}).to.throw(Error);
	});

	it('should throw an error if idAttribute is not provided', function() {
		expect(function() {
			DS.defineResource({
				name: 'person',
				collection: Backbone.Collection,
				model: Backbone.Model
			});
		}).to.throw(Error);
	});

	it('should throw an error if name is empty', function() {
		expect(function() {
			DS.defineResource({
				idAttribute: 'id',
				name: '',
				collection: Backbone.Collection,
				model: Backbone.Model
			});
		}).to.throw(Error);
	});

	it('should throw an error if a resource is already defined for a given name', function() {
		expect(function() {
			DS.defineResource({
				idAttribute: 'id',
				name: 'student',
				collection: Backbone.Collection,
				model: Backbone.Model
			});

			DS.defineResource({
				idAttribute: 'id',
				name: 'student',
				collection: Backbone.Collection,
				model: Backbone.Model
			});
		}).to.throw(Error);
	});
});