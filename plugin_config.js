import customReducer from './src/custom/store/slice';
import skeletonReducer from './src/skeleton/store/slice';


module.exports = {
    name: 'Sample Plugin',
    redux: {
        reducers: {
            skeleton: skeletonReducer, // Shared skeleton state
            customPluginA: customReducer, // Plugin-specific state
        },
    },
    frontend: {
        entry: './dist/react/bundle.js',
    },
    backend: {
        entry: './dist/node/index.js',
    },
};