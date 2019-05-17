/** ****************************************************************************************************
 * File: spellcheck.js
 * Project: pioneer
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 15-May-2019
 *******************************************************************************************************/
'use strict';

const
	_            = require( 'lodash' ),
	SpellChecker = require( 'spellchecker' );

async function spellCheck( page, showSuggestions = true ) {
	const rawText = await page.evaluate(
		() => Array.from(
			document.querySelectorAll( 'body' ),
			element => ( {
				nodeName: element.nodeName,
				textContent: element.textContent
			} )
		)
	);

	let words = _.map( rawText, ele => _.words( ele.textContent ) );
	words     = _.flatten( words );
	words     = _.filter( words, word => _.isNaN( _.toNumber( word ) ) );

	words = _.map( words,
		word => {
			if( SpellChecker.isMisspelled( word ) ) {
				const obj = { word };

				if( showSuggestions ) {
					obj.suggestions = SpellChecker.getCorrectionsForMisspelling( word );
				}

				return obj;
			}

			return null;
		}
	);

	words = _.filter( words, word => !_.isNull( word ) );

	return words;
}

module.exports = spellCheck;
