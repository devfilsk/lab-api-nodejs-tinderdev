const axios = require('axios');
const Dev = require('../models/Dev');
module.exports = {
    async index(req, res){
        const { user } = req.headers;
        const loggedDev = await Dev.findById(user);
        const users = await Dev.find({
            $and: [
                { _id: { $ne: user } },
                { _id: { $nin: loggedDev.likes }},
                { _id: { $nin: loggedDev.dislikes }},
            ]
        })

        return res.json(users);
    },

    async store(req, res){
        const { username } = req.body;

        // Verifica se existe o usuário antes de criar no banco de dados
        const userExists = await Dev.findOne({ user: username });
        if(userExists){
            return res.json(userExists)
        }

        // Pegando retrono da api-tinderdev do github
        const response = await axios.get(`https://api.github.com/users/${username}`);

        // pegando dados usando desestruturação do javascript
        const { name, bio, avatar_url: avatar } = response.data;

        // Criando novo Dev no banco de dados
        const dev = await Dev.create({
            name,
            user: username,
            bio,
            avatar,
        })

        return res.json(dev)
    }
};
