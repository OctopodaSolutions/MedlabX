import { UploadCssProperties } from '../../../functions/Program Functions/connection_functions';

class NokiCSS {
    constructor() {
        this.styles = {};
        this.buttonTypes = {};
        this.accessLevels = {};
        this.isInitialized = false;  
        this.initialize();
    }

    async initialize() {
        try {
            const getData = await UploadCssProperties();
            if (getData) {
                // console.log('data', getData);
                this.styles = getData.styles;
                this.buttonTypes = getData.buttonTypes;
                this.accessLevels = getData.accessLevels;
                this.isInitialized = true;  
            } else {
                console.log('No data received');
            }
        } catch (error) {
            console.error('Error in getData:', error);
        }
    }

    ensureInitialized() {
        if (!this.isInitialized) {
            console.log('NokiCSS not initialized. Ensure `initialize()` has completed.');
        }
    }

    getButtonStyle(type) {

        
        const baseStyle = { ...this.styles.button };
        return { ...baseStyle, ...this.buttonTypes[type] };
    }

    getFinalAccessLevel(accessLevel, overrideAccessLevel) {
        return overrideAccessLevel !== null ? overrideAccessLevel : accessLevel;
    }

    getInputFieldStyle(accessLevel, overrideAccessLevel = null) {
        const finalAccessLevel = this.getFinalAccessLevel(accessLevel, overrideAccessLevel);
        const baseStyle = { ...this.styles.inputField };
        const accessLevelCheck = this.checkAccessLevel(finalAccessLevel);
        return { ...baseStyle, ...accessLevelCheck };
    }

    checkAccessLevel(accessLevel) {
        return this.accessLevels[accessLevel] || {};
    }

    getButton(type, accessLevel, overrideAccessLevel = null) {
        
        const finalAccessLevel = this.getFinalAccessLevel(accessLevel, overrideAccessLevel);
        const buttonStyle = {
            ...this.getButtonStyle(type),
            ...this.checkAccessLevel(finalAccessLevel)
        };
        return buttonStyle;
    }
}

export default NokiCSS;
