/** ****************************************************************************************************
 * File: generateAuditReport.js
 * Project: pioneer
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 29-Jun-2019
 *******************************************************************************************************/
'use strict';

const
	config                = require( 'config' ),
	Response              = require( 'http-response-class' ),
	PDFDocument           = require( 'pdfkit' ),
	SVGToPDF              = require( 'svg-to-pdfkit' ),
	{ promises: fs }      = require( 'fs' ),
	{ createWriteStream } = require( 'fs' ),
	{ resolve }           = require( 'path' ),
	MongoDB               = require( '../../services/mongo/MongoDB' ),
	{
		validate,
		objectId
	}                     = require( '../../services/superstructs' );

module.exports.method = 'GET';
module.exports.route  = '/task/:_id/report';
module.exports.exec   = async ( req, res ) => {
	const p = res.locals;

	try {
		if ( p.params._id ) {
			await validate( objectId, p.params._id );
		}
		else {
			return p.respond( new Response( 400, 'requires _id' ) );
		}

		const
			Queue = MongoDB.collections.get( 'queue' );

		const doc = await Queue.findById( p.params._id );

		if ( !doc ) {
			return p.respond( new Response( 404, `${ p.params._id } not found` ) );
		}

		// Create a document
		const
			pdf     = new PDFDocument(),
			pdfPath = resolve( config.get( 'storage.path' ), `${ p.params._id }.pdf` );

		pdf.pipe( createWriteStream( pdfPath ) );

		// Add an image, constrain it to a given size, and center it vertically and horizontally

		const svg = await fs.readFile( resolve( config.get( 'storage.assets' ), 'Pioneer.svg' ), 'utf8' );

		SVGToPDF( pdf, svg, 206, 0, {
			preserveAspectRatio: 'none',
			width: 200,
			height: 200
		} );

		pdf.moveDown( 1 );

		// Embed a font, set the font size, and render some text
		pdf.font( resolve( config.get( 'storage.assets' ), 'Roboto-Regular.ttf' ) );
		pdf.fontSize( 25 );

		pdf.text( 'Pioneer Report', {
			width: 410,
			align: 'center'
		} );

		// Add another page
		pdf.addPage()
			.fontSize( 25 )
			.text( 'Here is some vector graphics...', 100, 100 );

		// Draw a triangle
		pdf.save()
			.moveTo( 100, 150 )
			.lineTo( 100, 250 )
			.lineTo( 200, 250 )
			.fill( '#FF3300' );

		// Apply some transforms and render an SVG path with the 'even-odd' fill rule
		pdf.scale( 0.6 )
			.translate( 470, -380 )
			.path( 'M 250,75 L 323,301 131,161 369,161 177,301 z' )
			.fill( 'red', 'even-odd' )
			.restore();

		// Add some text with annotations
		pdf.addPage()
			.fillColor( 'blue' )
			.text( 'Here is a link!', 100, 100 )
			.underline( 100, 100, 160, 27, { color: '#0000FF' } )
			.link( 100, 100, 160, 27, 'http://google.com/' );

		// Finalize PDF file
		pdf.end();

		return p.respond( new Response( 200, doc ) );
	} catch ( e ) {
		return e instanceof Response ?
			p.respond( e ) :
			p.respond( new Response( e.statusCode || 500, e.data || e.stack || e.message || e ) );
	}
};
