module.exports = module.exports = {
    app: {
        port: 8000,
        static_folder: `${__dirname}/../src/public`,
        email_user: "phamquyduong2k2@gmail.com",
        email_password: "vdbbwgykbxeumsuc",
        view_folder: `${__dirname}/../src/apps/views`,
        view_engine: "ejs",
    }, google: {
        clientID: "62154865103-lphich8h9i9pi8g8f7bivfsjmmbnaueq.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "http://localhost:8000/api/google/redirect"
    },
    facebook: {
        FACEBOOK_APP_ID: 464036862633020,
        FACEBOOK_APP_SECRET: "3368311a1a3625f8302a6c4218ceb5df",
        callbackURL: "http://localhost:8000/api/facebook/redirect",
    }
}
