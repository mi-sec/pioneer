export function anchorTodx( d, el ) {
	if ( d === 'middle' ) {
		return -el.getBBox().width / 2;
	}
	else if ( d === 'end' ) {
		return -el.getBBox().width;
	}
	return 0;
}

export function drawLink( source, target ) {
	return 'M' + transformNode( source.x, source.y ) +
		'C' + transformNode( source.x, ( source.y + target.y ) / 2 ) +
		' ' + transformNode( target.x, ( source.y + target.y ) / 2 ) +
		' ' + transformNode( target.x, target.y );
}

export function compareString( a, b ) {
	return ( a < b ) ? -1 : ( a > b ) ? 1 : 0;
}

export function compareNode( a, b, attribute ) {
	if ( a.height < b.height ) {
		return 1;
	}
	if ( a.height > b.height ) {
		return -1;
	}
	return compareString( a.data[ attribute ], b.data[ attribute ] );
}

export function findInParents( node, nodes ) {
	if ( nodes.indexOf( node ) !== -1 ) {
		return node;
	}

	const parent = node.parent;
	return ( parent === null ) ? node : findInParents( parent, nodes );
}

export function mapMany( arr, mapper ) {
	return arr.reduce( function( prev, curr ) {
		return prev.concat( mapper( curr ) );
	}, [] );
}

export function roundPath( pathString, precision = 0 ) {
	return pathString.replace( /\d+\.\d+/g, s => parseFloat( s ).toFixed( precision ) );
}

export function toPromise( transition ) {
	let count       = 0;
	let interrupted = false;
	transition.each( () => count++ );
	return new Promise( function( resolve, reject ) {
		if ( count === 0 ) {
			resolve( 'ended' );
			return;
		}
		const check = () => {
			if ( --count === 0 ) {
				resolve( interrupted ? 'interrupted' : 'ended' );
			}
		};
		transition.on( 'end', check );
		transition.on( 'interrupt', () => {
			interrupted = true;
			check();
		} );
	} );
}

export function translate( vector ) {
	return 'translate(' + transformNode( vector.x, vector.y ) + ')';
}

export function binarySearch( arr, left, right, value ) {
	if ( right < left ) {
		return right;
	}

	const mid = Math.round( left + ( right - left ) / 2 );
	if ( arr( mid ) === value ) {
		return mid;
	}

	return ( arr( mid ) > value ) ? binarySearch( arr, left, mid - 1, value ) : binarySearch( arr, mid + 1, right, value );
}

export function updateText( width ) {
	const textString = this.textContent;
	const textLength = textString.length;
	if ( this.getSubStringLength( 0, textLength ) <= width ) {
		return;
	}

	const index      = binarySearch( ( pos ) => this.getSubStringLength( 0, pos ), 0, textLength - 3, width );
	this.textContent = textString.substring( 0, index ) + '...';
}

export function updateTexts( selection, maxLength ) {
	if ( maxLength === -1 ) {
		return;
	}

	selection.each( function() {
		updateText.call( this, maxLength );
	} );
}

export function hasChildren( d ) {
	return d.children || d._children;
}

export function getChildren( d ) {
	return d.children ? { children: d.children, visible: true } : ( d._children ? {
		children: d._children,
		visible: false
	} : null );
}

export function onAllChilddren( d, callback, fatherVisible = undefined ) {
	if ( callback( d, fatherVisible ) === false ) {
		return;
	}
	const directChildren = getChildren( d );
	directChildren && directChildren.children.forEach( child => onAllChilddren( child, callback, directChildren.visible ) );
}

export function treeSize( tree, size, margin, { last, first } ) {
	tree.size( [ size.height - ( margin.y * 2 ), size.width - ( margin.x * 2 ) - ( last + first ) ] );
}

export function transformNode( x, y ) {
	return y + ',' + x;
}

export function transformSvg( svg, margin, size, { first } ) {
	return svg.attr( 'transform', 'translate(' + ( margin.x + first ) + ',' + margin.y + ')' );
}

export function updateTransform( transform, { x, y }, size, { first } ) {
	return transform.translate( x + first, y );
}

export function getLine( d3 ) {
	return d3.line()
		.x( d => d.data.x )
		.y( d => d.data.y );
}

export function transformText( text, children ) {
	return {
		x: !children ? 6 : -6,
		rotate: 0,
		anchor: !children ? 'start' : 'end'
	};
}
