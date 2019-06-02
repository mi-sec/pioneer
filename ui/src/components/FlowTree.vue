<template>
	<div class="viewport treeclass" v-resize="resize">
	</div>
</template>

<script>
	import * as d3 from 'd3';
	import resize  from 'vue-resize-directive';
	
	import {
		compareString,
		anchorTodx,
		drawLink,
		toPromise,
		findInParents,
		mapMany,
		translate,
		
		hasChildren,
		onAllChilddren,
		
		treeSize,
		transformSvg,
		updateTransform,
		transformText
	} from '@/utils/d3-utils';
	
	export default {
		name: 'FlowTree2',
		props: {
			data: Object,
			duration: {
				type: Number,
				default: 750
			},
			type: {
				type: String,
				default: 'cluster'
			},
			layoutType: {
				type: String,
				default: 'euclidean'
			},
			marginX: {
				type: Number,
				default: 20
			},
			marginY: {
				type: Number,
				default: 20
			},
			nodeText: {
				type: String,
				default: 'name'
			},
			identifier: {
				type: Function,
				default: () => this.i++
			},
			zoomable: {
				type: Boolean,
				default: false
			},
			radius: {
				type: Number,
				default: 5
			}
		},
		directives: {
			resize
		},
		data() {
			return {
				i: 0,
				currentTransform: null,
				currentSelected: null,
				maxTextLength: {
					first: 0,
					last: 0
				}
			};
		},
		mounted() {
			const
				size = this.getSize();
			
			this.svg = d3.select( this.$el )
				.append( 'svg' )
				.attr( 'width', size.width )
				.attr( 'height', size.height );
			
			this.g = this.svg.append( 'g' );
			
			this.zoom = d3.zoom()
				.scaleExtent( [ 0.9, 8 ] )
				.on( 'zoom', this.zoomed( this.g ) );
			
			this.svg.call( this.zoom ).on( 'wheel', () => d3.event.preventDefault() );
			this.svg.call( this.zoom.transform, d3.zoomIdentity );
			
			this.data && this.onData( this.data );
		},
		computed: {
			tree() {
				const tree = this.type === 'cluster' ? d3.cluster() : d3.tree();
				treeSize( tree, this.getSize(), this.margin, this.maxTextLength );
				return tree;
			},
			
			margin() {
				return {
					x: this.marginX,
					y: this.marginY
				};
			}
		},
		watch: {
			data: {
				handler( current ) {
					this.onData( current );
				},
				deep: true
			},
			
			type() {
				if ( !this.tree ) {
					return;
				}
				
				this.redraw();
			},
			
			marginX( newMarginX, oldMarginX ) {
				this.completeRedraw( { margin: { x: oldMarginX, y: this.marginY } } );
			},
			
			marginY( newMarginY, oldMarginY ) {
				this.completeRedraw( { margin: { x: this.marginX, y: oldMarginY } } );
			},
			
			radius() {
				this.completeRedraw();
			},
			
			zoomable( newValue ) {
				if ( newValue ) {
					this.zoom = d3.zoom().scaleExtent( [ 0.9, 8 ] );
					this.zoom.on( 'zoom', this.zoomed( this.g ) );
					this.svg.call( this.zoom ).on( 'wheel', () => d3.event.preventDefault() );
					this.svg.call( this.zoom.transform, this.currentTransform || d3.zoomIdentity );
				}
				else {
					this.zoom.on( 'zoom', null );
					this.zoom = null;
				}
			}
		},
		methods: {
			getSize() {
				return {
					width: this.$el.clientWidth,
					height: this.$el.clientHeight
				};
			},
			
			resize() {
				const size = this.getSize();
				this.svg
					.attr( 'width', size.width )
					.attr( 'height', size.height );
				
				treeSize( this.tree, size, this.margin, this.maxTextLength );
				this.applyZoom( size );
				this.redraw();
			},
			
			completeRedraw( { margin = null, layout = null } ) {
				const size = this.getSize();
				treeSize( this.tree, size, this.margin, this.maxTextLength );
				this.applyTransition( size, { margin, layout } );
				this.redraw();
			},
			
			transformSvg( g, size = this.getSize() ) {
				return transformSvg( g, this.margin, size, this.maxTextLength );
			},
			
			updateTransform( g, size ) {
				size = size || this.getSize();
				return updateTransform( g, this.margin, size, this.maxTextLength );
			},
			
			updateGraph( source = this.root ) {
				let
					originBuilder = source;
				
				const
					forExit = () => ( { x: source.x, y: source.y } ),
					origin  = {
						x: source.x0,
						y: source.y0
					};
				
				if ( arguments.length === 0 ) {
					originBuilder = d => {
						return d.parent == null ? origin :
							d.parent.x0 !== undefined ? { x: d.parent.x0, y: d.parent.y0 } :
								d.parent._x0 !== undefined ? { x: d.parent._x0, y: d.parent._y0 } :
									origin;
					};
					
					source = this.root;
				}
				else if ( typeof source === 'object' ) {
					originBuilder = () => origin;
				}
				
				const
					root  = this.root,
					links = this.g
						.selectAll( '.linktree' )
						.data(
							this.tree( root ).descendants().slice( 1 ),
							d => d.id
						);
				
				const
					updateLinks = links.enter().append( 'path' ).attr( 'class', 'linktree' ),
					nodes       = this.g.selectAll( '.nodetree' )
						.data( root.descendants(), d => d.id ),
					newNodes    = nodes.enter().append( 'g' ).attr( 'class', 'nodetree' ),
					allNodes    = newNodes.merge( nodes );
				
				nodes.each( d => {
					d._x0 = d.x;
					d._y0 = d.y;
				} );
				
				newNodes.append( 'text' )
					.attr( 'dy', '.35em' )
					.attr( 'x', 0 )
					.attr( 'dx', 0 )
					.attr( 'transform', 'rotate(0)' )
					.on( 'click', d => {
						this.currentSelected = this.currentSelected === d ? null : d;
						d3.event.stopPropagation();
						this.redraw();
						this.$emit( 'clicked', { element: d, data: d.data } );
					} );
				
				updateLinks.attr( 'd',
					d => drawLink( originBuilder( d ), originBuilder( d ) )
				);
				
				const
					updateAndNewLinks        = links.merge( updateLinks ),
					updateAndNewLinksPromise = toPromise(
						updateAndNewLinks
							.transition()
							.duration( this.duration )
							.attr( 'd', d => drawLink( d, d.parent ) )
					),
					exitingLinksPromise      = toPromise(
						links
							.exit()
							.transition()
							.duration( this.duration )
							.attr( 'd', d => drawLink( forExit( d ), forExit( d ) ) )
							.remove()
					);
				
				newNodes
					.attr( 'transform', d => translate( originBuilder( d ) ) )
					.append( 'circle' )
					.attr( 'r', this.radius );
				
				allNodes
					.classed( 'node--internal', d => hasChildren( d ) )
					.classed( 'node--leaf', d => !hasChildren( d ) )
					.classed( 'selected', d => d === this.currentSelected )
					.on( 'click', this.onNodeClick );
				
				const
					allNodesPromise = toPromise(
						allNodes
							.transition()
							.duration( this.duration )
							.attr( 'transform', d => translate( d ) )
							.attr( 'opacity', 1 )
					),
					text            = allNodes.select( 'text' ).text( d => d.data[ this.nodeText ] );
				
				allNodes.each( ( d ) => {
					d.textInfo = transformText( d, hasChildren( d ) );
				} );
				
				const textTransition = toPromise(
					text
						.transition()
						.duration( this.duration )
						.attr( 'x', d => d.textInfo.x )
						.attr( 'dx', function( d ) {
							return anchorTodx( d.textInfo.anchor, this );
						} )
						.attr( 'transform', d => `rotate(${ d.textInfo.rotate })` )
				);
				
				allNodes.each( ( d ) => {
					d.x0 = d.x;
					d.y0 = d.y;
				} );
				
				const
					exitingNodes        = nodes.exit(),
					exitingNodesPromise = toPromise(
						exitingNodes
							.transition()
							.duration( this.duration )
							.attr( 'transform', d => translate( forExit( d ) ) )
							.attr( 'opacity', 0 )
							.remove()
					);
				
				exitingNodes.select( 'circle' ).attr( 'r', 1e-6 );
				
				const
					leaves       = root.leaves(),
					extremeNodes = text.filter( d => leaves.indexOf( d ) !== -1 ).nodes(),
					last         = Math.max( ...extremeNodes.map( node => node.getComputedTextLength() ) ) + 6,
					first        = text.node().getComputedTextLength() + 6;
				
				if ( last <= this.maxTextLength.last && first <= this.maxTextLength.first ) {
					return Promise.all( [
						allNodesPromise,
						exitingNodesPromise,
						textTransition,
						updateAndNewLinksPromise,
						exitingLinksPromise
					] );
				}
				
				const size         = this.getSize();
				this.maxTextLength = { first, last };
				
				if ( this.zoomable ) {
					this.svg.call(
						this.zoom.transform,
						this.currentTransform
					);
				}
				else {
					this.transformSvg( this.g, size );
				}
				
				treeSize( this.tree, size, this.margin, this.maxTextLength );
				
				return this.updateGraph( source );
			},
			
			onNodeClick( d ) {
				d.children ? this.collapse( d ) : this.expand( d );
			},
			
			onData( data ) {
				if ( !data ) {
					this.root = null;
					this.clean();
					return;
				}
				
				const root = d3.hierarchy( data )
					.sort( ( a, b ) => compareString( a.data.text, b.data.text ) );
				
				this.root = root;
				
				root.each( d => d.id = this.identifier( d.data ) );
				
				const size = this.getSize();
				root.x     = size.height / 2;
				root.y     = 0;
				root.x0    = root.x;
				root.y0    = root.y;
				this.redraw();
			},
			
			clean() {
				[ '.linktree', '.nodetree', 'text', 'circle' ]
					.forEach(
						selector => this.g.selectAll( selector )
							.transition()
							.duration( this.duration )
							.attr( 'opacity', 0 )
							.remove()
					);
			},
			
			redraw() {
				return this.root ?
					this.updateGraph() :
					Promise.resolve( 'no graph' );
			},
			
			getNodeOriginComputer( originalVisibleNodes ) {
				return node => {
					const parentVisible = findInParents( node, originalVisibleNodes );
					return { x: parentVisible.x0, y: parentVisible.y0 };
				};
			},
			
			applyZoom() {
				this.g.call(
					this.zoom.transform,
					this.currentTransform
				);
			},
			
			applyTransition( size, { margin } ) {
				const
					transform         = this.currentTransform,
					oldMargin         = margin || this.margin,
					nowTransform      = updateTransform( transform, oldMargin, size, this.maxTextLength ),
					nextRealTransform = this.updateTransform( transform, size ),
					current           = d3.zoomIdentity
						.translate(
							transform.x + nowTransform.x - nextRealTransform.x,
							transform.y + nowTransform.y - nextRealTransform.y
						)
						.scale( transform.k );
				
				this.svg
					.call( this.zoom.transform, current )
					.transition()
					.duration( this.duration )
					.call( this.zoom.transform, transform );
			},
			
			zoomed( g ) {
				return () => {
					const
						transform        = d3.event.transform,
						size             = this.getSize(),
						transformToApply = this.updateTransform( transform, size );
					
					this.currentTransform = transform;
					this.$emit( 'zoom', { transform } );
					g.attr( 'transform', transformToApply );
				};
			},
			
			updateIfNeeded( d, update ) {
				return update ? this.updateGraph( d ).then( () => true ) : Promise.resolve( true );
				
				// if ( update ) {
				// 	await this.updateGraph( d );
				// }
				// return true;
			},
			
			// API
			collapse( d, update = true ) {
				if ( !d.children ) {
					return Promise.resolve( false );
				}
				
				d._children = d.children;
				d.children  = null;
				this.$emit( 'retract', { element: d, data: d.data } );
				return this.updateIfNeeded( d, update );
			},
			
			expand( d, update = true ) {
				if ( !d._children ) {
					return Promise.resolve( false );
				}
				
				d.children  = d._children;
				d._children = null;
				this.$emit( 'expand', { element: d, data: d.data } );
				return this.updateIfNeeded( d, update );
			},
			
			expandAll( d, update = true ) {
				const lastVisible = d.leaves();
				onAllChilddren( d, child => { this.expand( child, false ); } );
				return this.updateIfNeeded( this.getNodeOriginComputer( lastVisible ), update );
			},
			
			collapseAll( d, update = true ) {
				onAllChilddren( d, child => this.collapse( child, false ) );
				return this.updateIfNeeded( d, update );
			},
			
			show( d, update = true ) {
				const
					path = d.ancestors().reverse(),
					root = path.find( node => node.children === null ) || d;
				
				path.forEach( node => this.expand( node, false ) );
				return this.updateIfNeeded( root, update );
			},
			
			showOnly( d ) {
				const
					mapped            = {},
					path              = d.ancestors().reverse(),
					shouldBeRetracted = mapMany( path, p => p.children ? p.children : [] )
						.filter( node => node && ( path.indexOf( node ) === -1 ) );
				
				shouldBeRetracted
					.filter( node => node.children )
					.forEach(
						rectractedNode => rectractedNode
							.each( c => mapped[ c.id ] = rectractedNode )
					);
				
				const
					origin  = node => {
						const reference = mapped[ node.id ];
						return !reference ? node : { x: reference.x, y: reference.y };
					},
					updater = node => {
						if ( shouldBeRetracted.indexOf( node ) !== -1 ) {
							this.collapse( node, false );
							return false;
						}
						
						return ( node !== d );
					};
				
				onAllChilddren( this.root, updater );
				return this.updateGraph( origin ).then( () => true );
			},
			
			resetZoom() {
				const
					transitionPromise = toPromise(
						this.svg
							.transition()
							.duration( this.duration )
							.call( this.zoom.transform, () => d3.zoomIdentity )
					);
				
				return transitionPromise.then( () => true );
			}
		}
	};
</script>

<style>
	.treeclass .nodetree circle {
		fill: #999;
	}
	
	.treeclass .node--internal circle {
		cursor: pointer;
		fill: #555;
	}
	
	.treeclass .nodetree text {
		font: 10px sans-serif;
		cursor: pointer;
	}
	
	.treeclass .nodetree.selected text {
		font-weight: bold;
	}
	
	.treeclass .node--internal text {
		text-shadow: 0 1px 0 white,
		0 -1px 0 white,
		1px 0 0 white,
		-1px 0 0 white;
	}
	
	.treeclass .linktree {
		fill: none;
		stroke: #555;
		stroke-opacity: 0.4;
		stroke-width: 1.5px;
	}
	
	.treeclass {
		max-height: 100%;
		width: 100%;
	}
</style>
