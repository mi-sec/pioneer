<template>
    <v-navigation-drawer
        v-model="model"
        mini-variant
        permanent
        floating
        clipped
        left
        dark
        app
    >
        <v-list class="pt-0" dense>
            <v-divider></v-divider>

            <v-list-tile
                v-for="item in items"
                :key="item.title"
                @click="scrollTo( item.title )"
            >
                <v-tooltip
                    nudge-right="15"
                    open-delay="50"
                    right
                >
                    <template slot="activator" slot-scope="{ on }">
                        <v-list-tile-action v-on="on">
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-tile-action>
                    </template>

                    <v-list-tile-content>
                        <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                    </v-list-tile-content>
                </v-tooltip>
            </v-list-tile>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
export default {
    name: 'ScanSidebar',
    data() {
        return {
            model: null,
            items: [
                { title: 'Summary', icon: 'dashboard' },
                { title: 'Performance', icon: 'mdi-speedometer' }
            ]
        };
    },
    methods: {
        scrollTo( id ) {
            id = id.toLowerCase();
        }
    }
};
</script>
