<template>
	<div ref="container"></div>
</template>

<script>
	import * as d3 from 'd3';
	
	export default {
		name: 'FlowTree',
		props: [ 'treeData' ],
		data() {
			return {
				// Calculate total nodes, max label length
				totalNodes: 0,
				maxLabelLength: 0,
				
				// variables for drag/drop
				selectedNode: null,
				draggingNode: null,
				
				// panning variables
				panSpeed: 200,
				panBoundary: 20,
				
				// Misc. variables
				i: 0,
				duration: 750,
				root: null,
				
				// size of the diagram
				viewerWidth: 0,
				viewerHeight: 0,
				
				tree: null,
				zoomListener: null,
				baseSvg: null
			};
		},
		created() {
			window.addEventListener( 'resize', this.handleResize );
			this.handleResize();
		},
		mounted() {
			this.domNode = this.$refs.container;
			
			this.tree = d3.tree().size( [ this.viewerHeight, this.viewerWidth ] );
			
			// define a d3 diagonal projection for use by the node paths later on.
			// this.diagonal = d3.svg.diagonal().projection( d => [ d.y, d.x ] );
			
			// Call visit function to establish maxLabelLength
			this.visit(
				this.treeData,
				d => {
					this.totalNodes++;
					this.maxLabelLength = Math.max( d.name.length, this.maxLabelLength );
				},
				d => d.children && d.children.length > 0 ? d.children : null
			);
			
			// Sort the tree initially incase the JSON isn't in a sorted order.
			this.sortTree();
			
			// define the zoomListener that calls the zoom function on the zoom event constrained in the scaleExtents
			this.zoomListener = d3
				.behavior
				.zoom()
				.scaleExtent( [ 0.1, 3 ] )
				.on( 'zoom', this.zoom );
			
			
			// define the baseSvg, attaching a class for styling and the zoomListener
			this.baseSvg = d3
				.select( '#tree-container' )
				.append( 'svg' )
				.attr( 'width', this.viewerWidth )
				.attr( 'height', this.viewerHeight )
				.attr( 'class', 'overlay' )
				.call( this.zoomListener );
			
			
			// Define the drag listeners for drag/drop behaviour of nodes.
			this.dragListener = d3
				.behavior
				.drag()
				.on( 'dragstart', d => {
					if ( d === this.root ) {
						return;
					}
					
					this.dragStarted = true;
					this.nodes       = this.tree.nodes( d );
					d3.event.sourceEvent.stopPropagation();
					// it's important that we suppress the mouseover event on the node being dragged. Otherwise it will absorb the mouseover event and the underlying node will not detect it d3.select(this).attr('pointer-events', 'none');
				} )
				.on( 'drag', d => {
					if ( d === this.root ) {
						return;
					}
					else if ( this.dragStarted ) {
						this.initiateDrag( d, this.$el );
					}
					
					// get coords of mouseEvent relative to svg container to allow for panning
					this.relCoords = d3.mouse( d3.select( 'svg' ).get( 0 ) );
					
					if ( this.relCoords[ 0 ] < this.panBoundary ) {
						this.panTimer = true;
						this.pan( this, 'left' );
					}
					else if ( this.relCoords[ 0 ] > ( d3.select( 'svg' ).width() - this.panBoundary ) ) {
						this.panTimer = true;
						this.pan( this, 'right' );
					}
					else if ( this.relCoords[ 1 ] < this.panBoundary ) {
						this.panTimer = true;
						this.pan( this, 'up' );
					}
					else if ( this.relCoords[ 1 ] > ( d3.select( 'svg' ).height() - this.panBoundary ) ) {
						this.panTimer = true;
						this.pan( this, 'down' );
					}
					else {
						try {
							clearTimeout( this.panTimer );
						} catch ( e ) {
							console.error( e );
						}
					}
					
					d.x0 += d3.event.dy;
					d.y0 += d3.event.dx;
					
					const node = d3.select( this.$el );
					node.attr( 'transform', 'translate(' + d.y0 + ',' + d.x0 + ')' );
					this.updateTempConnector();
				} )
				.on( 'dragend', d => {
					if ( d === this.root ) {
						return;
					}
					
					if ( this.selectedNode ) {
						// now remove the element from the parent, and insert it into the new elements children
						const index = this.draggingNode.parent.children.indexOf( this.draggingNode );
						
						if ( index > -1 ) {
							this.draggingNode.parent.children.splice( index, 1 );
						}
						
						if ( typeof this.selectedNode.children !== 'undefined' ||
							typeof this.selectedNode._children !== 'undefined'
						) {
							if ( typeof this.selectedNode.children !== 'undefined' ) {
								this.selectedNode.children.push( this.draggingNode );
							}
							else {
								this.selectedNode._children.push( this.draggingNode );
							}
						}
						else {
							this.selectedNode.children = [];
							this.selectedNode.children.push( this.draggingNode );
						}
						
						// Make sure that the node being added to is expanded so user can see added node is correctly moved
						this.expand( this.selectedNode );
						this.sortTree();
						this.endDrag();
					}
					else {
						this.endDrag();
					}
				} );
			
			
			// Append a group which holds all nodes and which the zoom Listener can act upon.
			this.svgGroup = this.baseSvg.append( 'g' );
			
			// Define the root
			this.root    = this.treeData;
			this.root.x0 = this.viewerHeight / 2;
			this.root.y0 = 0;
			
			// Layout the tree initially and center on the root node.
			this.update( this.root );
			this.centerNode( this.root );
		},
		destroyed() {
			window.removeEventListener( 'resize', this.handleResize );
		},
		methods: {
			handleResize() {
				this.viewerWidth  = window.innerWidth;
				this.viewerHeight = window.innerHeight;
			},
			
			// A recursive helper function for performing some setup by walking through all nodes
			visit( parent, visitFn, childrenFn ) {
				if ( !parent ) {
					return;
				}
				
				visitFn( parent );
				
				const children = childrenFn( parent );
				if ( children ) {
					const count = children.length;
					for ( let i = 0; i < count; i++ ) {
						this.visit( children[ i ], visitFn, childrenFn );
					}
				}
			},
			
			// sort the tree according to the node names
			sortTree() {
				console.log( this.tree );
				this.tree().sort(
					( a, b ) => b.name.toLowerCase() < a.name.toLowerCase() ? 1 : -1
				);
			},
			
			pan( domNode, direction ) {
				const speed = this.panSpeed;
				if ( this.panTimer ) {
					clearTimeout( this.panTimer );
					this.translateCoords = d3.transform( this.svgGroup.attr( 'transform' ) );
					if ( direction === 'left' || direction === 'right' ) {
						this.translateX = direction === 'left' ?
							this.translateCoords.translate[ 0 ] + speed :
							this.translateCoords.translate[ 0 ] - speed;
						
						this.translateY = this.translateCoords.translate[ 1 ];
					}
					else if ( direction === 'up' || direction === 'down' ) {
						this.translateX = this.translateCoords.translate[ 0 ];
						
						this.translateY = direction === 'up' ?
							this.translateCoords.translate[ 1 ] + speed :
							this.translateCoords.translate[ 1 ] - speed;
					}
					
					this.scaleX = this.translateCoords.scale[ 0 ];
					this.scaleY = this.translateCoords.scale[ 1 ];
					this.scale  = this.zoomListener.scale();
					
					this.svgGroup
						.transition()
						.attr(
							'transform',
							'translate(' + this.translateX + ',' + this.translateY + ')scale(' + this.scale + ')'
						);
					
					d3.select( domNode )
						.select( 'g.node' )
						.attr(
							'transform',
							'translate(' + this.translateX + ',' + this.translateY + ')'
						);
					
					this.zoomListener.scale( this.zoomListener.scale() );
					this.zoomListener.translate( [ this.translateX, this.translateY ] );
					
					this.panTimer = setTimeout(
						() => this.pan( domNode, speed, direction ),
						50
					);
				}
			},
			
			// Define the zoom function for the zoomable tree
			zoom() {
				this.svgGroup.attr(
					'transform',
					'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')'
				);
			},
			
			initiateDrag( d, domNode ) {
				this.draggingNode = d;
				
				d3.select( domNode ).select( '.ghostCircle' ).attr( 'pointer-events', 'none' );
				d3.selectAll( '.ghostCircle' ).attr( 'class', 'ghostCircle show' );
				d3.select( domNode ).attr( 'class', 'node activeDrag' );
				
				this.svgGroup
					.selectAll( 'g.node' )
					// select the parent and sort the path's
					// a is not the hovered element, send "a" to the back
					// a is the hovered element, bring "a" to the front
					.sort( a => a.id !== this.draggingNode.id ? 1 : -1 );
				
				// if nodes has children, remove the links and nodes
				if ( this.nodes.length > 1 ) {
					// remove link paths
					this.links = this.tree.links( this.nodes );
					
					this.nodePaths = this.svgGroup
						.selectAll( 'path.link' )
						.data( this.links, d => d.target.id ).remove();
					
					// remove child nodes
					this.nodesExit = this.svgGroup
						.selectAll( 'g.node' )
						.data( this.nodes, d => d.id )
						.filter( d => !( d.id === this.draggingNode.id ) )
						.remove();
				}
				
				// remove parent link
				this.parentLink = this.tree.links(
					this.tree.nodes( this.draggingNode.parent )
				);
				
				this.svgGroup
					.selectAll( 'path.link' )
					.filter( d => d.target.id === this.draggingNode.id )
					.remove();
				
				this.dragStarted = null;
			},
			
			endDrag() {
				this.selectedNode = null;
				d3.selectAll( '.ghostCircle' ).attr( 'class', 'ghostCircle' );
				d3.select( this.domNode ).attr( 'class', 'node' );
				
				// now restore the mouseover event or we won't be able to drag a 2nd time
				d3.select( this.domNode ).select( '.ghostCircle' ).attr( 'pointer-events', '' );
				this.updateTempConnector();
				
				if ( draggingNode !== null ) {
					this.update( this.root );
					this.centerNode( this.draggingNode );
					this.draggingNode = null;
				}
			},
			
			// Helper functions for collapsing and expanding nodes.
			collapse( d ) {
				if ( d.children ) {
					d._children = d.children;
					d._children.forEach( this.collapse );
					d.children = null;
				}
			},
			
			expand( d ) {
				if ( d._children ) {
					d.children = d._children;
					d.children.forEach( this.expand );
					d._children = null;
				}
			},
			
			overCircle( d ) {
				this.selectedNode = d;
				this.updateTempConnector();
			},
			outCircle() {
				this.selectedNode = null;
				this.updateTempConnector();
			},
			
			// Function to update the temporary connector indicating dragging affiliation
			updateTempConnector() {
				let data = [];
				if ( this.draggingNode !== null && this.selectedNode !== null ) {
					// have to flip the source coordinates since we did this for the existing connectors on the original tree
					data = [ {
						source: {
							x: this.selectedNode.y0,
							y: this.selectedNode.x0
						},
						target: {
							x: this.draggingNode.y0,
							y: this.draggingNode.x0
						}
					} ];
				}
				
				const link = this.svgGroup.selectAll( '.templink' ).data( data );
				
				link.enter().append( 'path' )
					.attr( 'class', 'templink' )
					.attr( 'd', this.diagonal() )
					.attr( 'pointer-events', 'none' );
				
				link.attr( 'd', this.diagonal() );
				
				link.exit().remove();
			},
			
			// Function to center node when clicked/dropped so node doesn't get lost when collapsing/moving with large amount of children.
			centerNode( source ) {
				this.scale = this.zoomListener.scale();
				this.x     = -source.y0;
				this.y     = -source.x0;
				this.x     = this.x * this.scale + this.viewerWidth / 2;
				this.y     = this.y * this.scale + this.viewerHeight / 2;
				
				d3.select( 'g' ).transition()
					.duration( this.duration )
					.attr( 'transform', 'translate(' + this.x + ',' + this.y + ')scale(' + this.scale + ')' );
				
				this.zoomListener.scale( this.scale );
				this.zoomListener.translate( [ this.x, this.y ] );
			},
			
			// Toggle children function
			toggleChildren( d ) {
				if ( d.children ) {
					d._children = d.children;
					d.children  = null;
				}
				else if ( d._children ) {
					d.children  = d._children;
					d._children = null;
				}
				
				return d;
			},
			
			// Toggle children on click.
			click( d ) {
				if ( d3.event.defaultPrevented ) {
					return;
				} // click suppressed
				
				d = this.toggleChildren( d );
				this.update( d );
				this.centerNode( d );
			},
			
			update( source ) {
				// Compute the new height, function counts total children of root node and sets tree height accordingly.
				// This prevents the layout looking squashed when new nodes are made visible or looking sparse when nodes are removed
				// This makes the layout more consistent.
				const levelWidth = [ 1 ];
				const childCount = ( level, n ) => {
					if ( n.children && n.children.length > 0 ) {
						if ( levelWidth.length <= level + 1 ) {
							levelWidth.push( 0 );
						}
						
						levelWidth[ level + 1 ] += n.children.length;
						n.children.forEach( d => childCount( level + 1, d ) );
					}
				};
				
				childCount( 0, this.root );
				
				const newHeight = d3.max( levelWidth ) * 25; // 25 pixels per line
				
				this.tree = this.tree.size( [ newHeight, this.viewerWidth ] );
				
				// Compute the new tree layout.
				const
					nodes = this.tree.nodes( this.root ).reverse(),
					links = this.tree.links( nodes );
				
				// Set widths between levels based on maxLabelLength.
				nodes.forEach( d => {
					d.y = ( d.depth * ( this.maxLabelLength * 10 ) );
					// maxLabelLength * 10px
					// alternatively to keep a fixed scale one can set a fixed depth per level
					// Normalize for fixed-depth by commenting out below line
					// d.y = (d.depth * 500); //500px per level.
				} );
				
				// Update the nodes…
				this.node = this.svgGroup
					.selectAll( 'g.node' )
					.data( nodes, d => d.id || ( d.id = ++i ) );
				
				// Enter any new nodes at the parent's previous position.
				const nodeEnter = this.node
					.enter()
					.append( 'g' )
					.call( this.dragListener )
					.attr( 'class', 'node' )
					.attr( 'transform', () => 'translate(' + source.y0 + ',' + source.x0 + ')' )
					.on( 'click', this.click );
				
				nodeEnter.append( 'circle' )
					.attr( 'class', 'nodeCircle' )
					.attr( 'r', 0 )
					.style( 'fill', d => d._children ? 'lightsteelblue' : '#fff' );
				
				nodeEnter.append( 'text' )
					.attr( 'x', d => d.children || d._children ? -10 : 10 )
					.attr( 'dy', '.35em' )
					.attr( 'class', 'nodeText' )
					.attr( 'text-anchor', function( d ) {
						return d.children || d._children ? 'end' : 'start';
					} )
					.text( function( d ) {
						return d.name;
					} )
					.style( 'fill-opacity', 0 );
				
				// phantom node to give us mouseover in a radius around it
				nodeEnter.append( 'circle' )
					.attr( 'class', 'ghostCircle' )
					.attr( 'r', 30 )
					.attr( 'opacity', 0.2 ) // change this to zero to hide the target area
					.style( 'fill', 'red' )
					.attr( 'pointer-events', 'mouseover' )
					.on( 'mouseover', function( node ) {
						overCircle( node );
					} )
					.on( 'mouseout', function( node ) {
						outCircle( node );
					} );
				
				// Update the text to reflect whether node has children or not.
				this.node.select( 'text' )
					.attr( 'x', function( d ) {
						return d.children || d._children ? -10 : 10;
					} )
					.attr( 'text-anchor', function( d ) {
						return d.children || d._children ? 'end' : 'start';
					} )
					.text( function( d ) {
						return d.name;
					} );
				
				// Change the circle fill depending on whether it has children and is collapsed
				this.node.select( 'circle.nodeCircle' )
					.attr( 'r', 4.5 )
					.style( 'fill', function( d ) {
						return d._children ? 'lightsteelblue' : '#fff';
					} );
				
				// Transition nodes to their new position.
				const nodeUpdate = this.node.transition()
					.duration( this.duration )
					.attr( 'transform', function( d ) {
						return 'translate(' + d.y + ',' + d.x + ')';
					} );
				
				// Fade the text in
				nodeUpdate.select( 'text' )
					.style( 'fill-opacity', 1 );
				
				// Transition exiting nodes to the parent's new position.
				const nodeExit = this.node.exit().transition()
					.duration( this.duration )
					.attr( 'transform', function( d ) {
						return 'translate(' + source.y + ',' + source.x + ')';
					} )
					.remove();
				
				nodeExit.select( 'circle' )
					.attr( 'r', 0 );
				
				nodeExit.select( 'text' )
					.style( 'fill-opacity', 0 );
				
				// Update the links…
				const link = this.svgGroup.selectAll( 'path.link' )
					.data( links, function( d ) {
						return d.target.id;
					} );
				
				// Enter any new links at the parent's previous position.
				link.enter().insert( 'path', 'g' )
					.attr( 'class', 'link' )
					.attr( 'd', d => {
						const o = {
							x: source.x0,
							y: source.y0
						};
						
						return this.diagonal( {
							source: o,
							target: o
						} );
					} );
				
				// Transition links to their new position.
				link.transition()
					.duration( this.duration )
					.attr( 'd', this.diagonal );
				
				// Transition exiting nodes to the parent's new position.
				link.exit().transition()
					.duration( this.duration )
					.attr( 'd', ( d ) => {
						const o = {
							x: source.x,
							y: source.y
						};
						return this.diagonal( {
							source: o,
							target: o
						} );
					} )
					.remove();
				
				// Stash the old positions for transition.
				nodes.forEach( function( d ) {
					d.x0 = d.x;
					d.y0 = d.y;
				} );
			}
		},
		diagonal( d ) {
			return 'M' + d.source.y + ',' + d.source.x
				+ 'C' + ( d.source.y + d.target.y ) / 2 + ',' + d.source.x
				+ ' ' + ( d.source.y + d.target.y ) / 2 + ',' + d.target.x
				+ ' ' + d.target.y + ',' + d.target.x;
		}
	};
</script>

<style scoped>
	.node {
		cursor: pointer;
	}
	
	.overlay {
		background-color: #EEE;
	}
	
	.node circle {
		fill: #fff;
		stroke: steelblue;
		stroke-width: 1.5px;
	}
	
	.node text {
		font-size: 10px;
		font-family: sans-serif;
	}
	
	.link {
		fill: none;
		stroke: #ccc;
		stroke-width: 1.5px;
	}
	
	.templink {
		fill: none;
		stroke: red;
		stroke-width: 3px;
	}
	
	.ghostCircle.show {
		display: block;
	}
	
	.ghostCircle, .activeDrag .ghostCircle {
		display: none;
	}
</style>
