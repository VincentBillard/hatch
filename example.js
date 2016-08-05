var Hatch = require('hatch');

new Hatch({
    name: 'example',
    src_path: 'C:/projects/example',
    deploy_path:  'C:/deployments',
    generated_files: [
        'public/build',
    ]
});