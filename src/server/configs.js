module.exports = {
    staticPath: process.env.NODE_ENV == 'production' ? '../client' : '../../dist/client',
    port: 3000,
    queue: {
        maxSize: 3000
    },
    loggers: {
        app: {
            level: 'verbose',
            filename: './dist/logs/app.log'
        },
        access: {
            level: 'verbose',
            filename: './dist/logs/access.log'
        },
        actions: {
            level: 'info',
            filename: './dist/logs/actions.log'
        }
    }
}