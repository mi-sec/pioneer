<template>
    <v-card
        max-height="100%"
        min-height="124"
        max-width="100%"
        min-width="200"
        class="card"
        raised
        hover
        ma-0
        pa-0
    >
        <v-card-text class="ma-0 pa-0">
            <v-layout
                justify-space-around
                align-start
                ma-0
                pa-0
            >

                <v-flex
                    :class="[
						'gradeBox',
						calculateColorForGrade()
					]"
                    elevation-3
                    left
                    xs4
                >
                    <v-icon size="48" color="white">
                        {{ calculateIconForGrade() }}
                    </v-icon>
                </v-flex>

                <v-flex
                    font-weight-bold
                    left
                    xs8
                >
                    {{ category.title }}
                </v-flex>

                <v-flex
                    class="text-xs-right"
                    font-weight-light
                    right
                    xs4
                >
                    {{ category.score * 100 }}%
                </v-flex>

            </v-layout>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    name: 'StatsCard',
    props: {
        category: Object
    },
    methods: {
        calculateIconForGrade() {
            const n = this.category.score;

            return n >= 0.9 ? 'mdi-alpha-a' :
                n >= 0.8 ? 'mdi-alpha-b' :
                n >= 0.7 ? 'mdi-alpha-c' :
                n >= 0.6 ? 'mdi-alpha-d' :
                'mdi-alpha-f';
        },
        calculateColorForGrade() {
            const n = this.category.score;

            return n >= 0.9 ? 'A' :
                n >= 0.8 ? 'B' :
                n >= 0.7 ? 'C' :
                n >= 0.6 ? 'D' :
                'F';
        }
    }
};
</script>

<style lang="scss" scoped>
.card {
    margin-top: 24px;
    margin-bottom: 24px;
}

.gradeBox {
    position: absolute;

    bottom: -16px !important;
    left: 8px;

    border-radius: 2px;
}

.A {
    background: linear-gradient(60deg, #6eca73, #43a047) !important;
}

.B {
    background: linear-gradient(60deg, #caca5a, #b0b000) !important;
}

.C {
    background: linear-gradient(60deg, #ffa726, #fb8c00) !important;
}

.D {
    background: linear-gradient(60deg, #ef5350, #e53935) !important;
}

.F {
    background: linear-gradient(60deg, #cd4542, #b41414) !important;
}
</style>
