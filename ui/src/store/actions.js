export default {
    async loadApiConfig( context ) {
        try {
            const data = await this.$api.getConfig();
            context.commit( 'commitConfig', data );
        }
        catch ( e ) {
            console.error( e );
        }
    }
};
