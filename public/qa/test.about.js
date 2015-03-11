// Creation Date: 2015.03.11
// Author: Fernando L. Canizo - http://flc.muriandre.com/

"use strict";


suite('About', function () {
	test('page should contain link to contact page', function () {
		assert($('a[href="/contact"]').length);
	});
});
