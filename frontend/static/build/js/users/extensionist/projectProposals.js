'use strict';

const ProjectProposals = (() => {
    
    /**
     * * Global Variables
     * ==============================================
     */
    let loaded = false;
    
    /**
     * * Functions and Classes
     * ==============================================
     */

    /**
     * * Return on DOM load
     * ==============================================
     */
    return {
        load: () => {
            if(!loaded) {
                console.log('Loaded');
                loaded = true;
            }
        }
    }
})();

(() => ProjectProposals.load());