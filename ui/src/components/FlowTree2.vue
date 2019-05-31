<template>
	<svg
		width="800"
		height="920"
	>
		<g class="wrapper" transform="translate(20, 20)">
			<g class="links"></g>
			<g class="nodes"></g>
		</g>
	</svg>
</template>

<script>
	import * as d3 from 'd3';
	
	export default {
		name: 'FlowTree2',
		props: [ 'treeData' ],
		data() {
			return {
				viewerWidth: 0,
				viewerHeight: 0,
				
				root: null
			};
		},
		created() {
			window.addEventListener( 'resize', this.handleResize );
			this.handleResize();
		},
		mounted() {
			let nest = d3.nest();
			// .key( function( d ) { return d.Genre; } )
			// .key( function( d ) { return d[ 'Lead Studio' ]; } )
			// .entries( this.treeData );
			
			console.log( nest );
			
			nest = {
				key: 'root',
				values: nest
			};
			
			this.root = d3.hierarchy( this.treeData, function( d ) {
				console.log( d );
				return d.values;
			} );
		},
		methods: {
			handleResize() {
				this.viewerWidth  = window.innerWidth;
				this.viewerHeight = window.innerHeight;
			},
			
			treeLayout( root ) {
				return d3.tree()
					.size( [ this.viewerWidth, this.viewerHeight ] );
			}
		}
	};
</script>
