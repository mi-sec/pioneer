<template>
    <v-container
        v-if="treeData"
        fluid
        ma-0
        pa-0
    >
        <FlowTree
            ref="tree"
            class="tree"
            :type="type"
            :data="treeData"
            :node-text="nodeText"
            :identifier="getId"
            :zoomable="zoomable"
            :margin-x="Marginx"
            :margin-y="Marginy"
            :radius="radius"
            :layout-type="layoutType"
            :duration="duration"
            @clicked="onClick"
            @expand="onExpand"
            @retract="onRetract"
        />
    </v-container>
</template>

<script>
import * as d3  from 'd3';
import LightMap from '@mi-sec/lightmap';

import Resource from '@/utils/Resource';
import FlowTree from '@/components/FlowTree';

export default {
    name: 'Home',
    components: {
        FlowTree
    },
    data() {
        return {
            nodeText: 'url',
            treeData: null,
            type: 'tree',
            layoutType: 'euclidean',
            radius: 6,
            Marginx: 30,
            Marginy: 30,
            duration: 750,
            currentNode: null,
            zoomable: true,
            isLoading: false,
            events: []
        };
    },
    mounted() {
        console.log( this.$route.params._id );
        this.fetchData();
    },
    methods: {
        async fetchData() {
            let treedata  = await d3.json( './treeData.json' );
            this.treeData = treedata;
            // this.treeData = treedata.Graph.tree;
            console.log( this.treeData );
            return;

            let data = await d3.json( './scantree.json' );
            data     = new LightMap( data );

            const
                entryNode = data.get( 'nodes' ).get( data.get( 'baseUrl' ) ),
                rootNode  = new Resource( entryNode );

            function mapNodeLinks( node ) {
                if ( !Object.prototype.hasOwnProperty.call( node, 'links' ) ) {
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
            this.treeData  = rootNode;
            console.log( this.treeData );
        },
        do( action ) {
            if ( this.currentNode ) {
                this.isLoading = true;
                this.$refs[ 'tree' ][ action ]( this.currentNode ).then( () => { this.isLoading = false; } );
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
        }
    }
};
</script>

<style>
.tree {
    height: 800px;
}
</style>
