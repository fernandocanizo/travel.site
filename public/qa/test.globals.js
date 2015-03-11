// Creation Date: 2015.03.11
// Author: Fernando L. Canizo - http://flc.muriandre.com/

"use strict";

suite('Global Tests', function () {
	test('Page has a valid title', function () {
		assert(document.title && document.title.match(/\S/) && document.title.toUpperCase() !== 'TODO');
	});
});
