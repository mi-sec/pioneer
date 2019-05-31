<template>
	<v-container
		v-if="loadData"
		fluid
		ma-0
		pa-0
	>
		<FlowTree2
			ref="tree"
			class="tree"
			:identifier="getId"
			:treeData="loadData"
			:node-text="nodeText"
			:margin-x="Marginx"
			:margin-y="Marginy"
			@clicked="onClick"
			@expand="onExpand"
			@retract="onRetract"
		/>
	</v-container>
</template>

<script>
	import * as d3  from 'd3';
	import LightMap from '@mi-sec/lightmap';
	
	import FlowTree2 from '@/components/FlowTree2';
	import Resource  from '@/utils/Resource';
	
	export default {
		name: 'Home',
		components: {
			FlowTree2
		},
		data() {
			return {
				nodeText: 'url',
				loadData: null,
				Marginx: 30,
				Marginy: 30,
				radius: 3,
				currentNode: null,
				isLoading: false,
				events: []
			};
		},
		mounted() {
			console.log( 'App loaded' );
			this.fetchData();
		},
		methods: {
			do( action ) {
				console.log( 'do', action );
				if ( this.currentNode ) {
					this.isLoading = true;
					this.$refs[ 'tree' ][ action ]( this.currentNode )
						.then( () => this.isLoading = false );
				}
			},
			getId( node ) {
				return node.id;
			},
			expandAll() {
				this.do( 'expandAll' );
			},
			collapseAll() {
				this.do( 'collapseAll' );
			},
			showOnly() {
				this.do( 'showOnly' );
			},
			show() {
				this.do( 'show' );
			},
			onClick( evt ) {
				this.currentNode = evt.element;
				this.onEvent( 'onClick', evt );
			},
			onExpand( evt ) {
				this.onEvent( 'onExpand', evt );
			},
			onRetract( evt ) {
				this.onEvent( 'onRetract', evt );
			},
			onEvent( eventName, data ) {
				this.events.push( { eventName, data: data.data } );
			},
			resetZoom() {
				if ( !this.$refs[ 'tree' ] ) {
					return;
				}
				this.isLoading = true;
				this.$refs[ 'tree' ].resetZoom().then( () => { this.isLoading = false; } );
			},
			async fetchData() {
				let data = await d3.json( './scantree.json' );
				data     = new LightMap( data );
				
				const
					entryNode = data.get( 'nodes' ).get( data.get( 'baseUrl' ) ),
					rootNode  = new Resource( entryNode );
				
				function mapNodeLinks( node ) {
					if ( !node.hasOwnProperty( 'links' ) ) {
						return node;
					}
					
					return node.links.map(
						link => {
							if ( data.get( 'nodes' ).has( link.url ) ) {
								const _node = new Resource( data.get( 'nodes' ).get( link.url ) );
								_node.links = mapNodeLinks( _node );
								return _node;
							}
							else {
								return link;
							}
						}
					);
				}
				
				rootNode.links = mapNodeLinks( rootNode );
				this.loadData  = rootNode;
			}
		}
	};
</script>

<style>
	.tree {
		height: 800px;
	}
</style>
