describe('DS', function() {
	it('should be a Backbone Model itself to store arbitrary data', function() {
		expect(DS).to.be.an.instanceof(Backbone.Model);
	});
});