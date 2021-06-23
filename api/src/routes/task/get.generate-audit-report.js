'use strict';

const
    config                = require( 'config' ),
    PDFDocument           = require( 'pdfkit' ),
    SVGToPDF              = require( 'svg-to-pdfkit' ),
    { promises: fs }      = require( 'fs' ),
    { createWriteStream } = require( 'fs' ),
    { resolve }           = require( 'path' ),
    MongoDB               = require( '../../services/MongoDB' );

module.exports.method = 'GET';
module.exports.route  = '/task/:_id/report';
module.exports.exec   = async ( req, res ) => {
    try {
        if ( req.params._id ) {
            // await validate( objectId, p.params._id );
        }
        else {
            return res.status( 400 ).json( { message: '_id required' } );
        }

        const
            Queue = MongoDB.collections.get( 'queue' );

        const doc = await Queue.findById( req.params._id );

        if ( !doc ) {
            return res.status( 404 ).json( { message: `${ req.params._id } not found` } );
        }

        // Create a document
        const
            pdf     = new PDFDocument(),
            pdfPath = resolve( config.get( 'storage.path' ), `${ req.params._id }.pdf` );

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

        return res.status( 200 ).json( doc );
    }
    catch ( e ) {
        return res.status( 400 ).json( { error: typeof e === 'string' ? e : e.message } );
    }
};
