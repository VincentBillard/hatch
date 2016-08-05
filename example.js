var Hatch = require('node-hatch');

new Hatch({
    name: 'example',
    src_path: 'C:/projects/example',
    deploy_path:  'C:/deployments',
    generated_files: [
        'public/build',
    ]
});
