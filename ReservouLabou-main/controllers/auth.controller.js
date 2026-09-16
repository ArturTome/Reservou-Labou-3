const bcrypt = require("bcrypt");
const { Usuario } = require("../models");

class AuthController {

    /* ==========================
       TELAS
    ========================== */

    static loginPage(req, res) {

        res.render("auth/login");

    }

    static cadastroPage(req, res) {

        res.render("auth/cadastro");

    }

    /* ==========================
       LOGIN
    ========================== */

    static async login(req, res) {

        try {

            const { login, senha } = req.body;

            if (!login || !senha) {

                return res.render("auth/login", {
                    erro: "Preencha todos os campos."
                });

            }

            const usuario = await Usuario.findOne({
                where: {
                    Login: login
                }
            });

            if (!usuario) {

                return res.render("auth/login", {
                    erro: "Usuário não encontrado."
                });

            }

            const senhaCorreta =
                await bcrypt.compare(
                    senha,
                    usuario.Senha
                );

            if (!senhaCorreta) {

                return res.render("auth/login", {
                    erro: "Senha incorreta."
                });

            }

            req.session.usuario = {

                id: usuario.IdUser,

                login: usuario.Login,

                admin: usuario.StatusADM

            };

            res.redirect("/");

        }

        catch (erro) {

            console.log(erro);

            res.status(500).send("Erro interno.");

        }

    }

    /* ==========================
       CADASTRO
    ========================== */

    static async cadastrar(req, res) {

        try {

            const {

                login,

                senha

            } = req.body;

            if (!login || !senha) {

                return res.render("auth/cadastro", {

                    erro: "Todos os campos são obrigatórios."

                });

            }

            const existe =

                await Usuario.findOne({

                    where: {

                        Login: login

                    }

                });

            if (existe) {

                return res.render("auth/cadastro", {

                    erro: "Login já existente."

                });

            }

            const hash =

                await bcrypt.hash(

                    senha,

                    10

                );

            await Usuario.create({

                Login: login,

                Senha: hash,

                StatusADM: false

            });

            res.redirect("/login");

        }

        catch (erro) {

            console.log(erro);

            res.status(500).send("Erro.");

        }

    }

    /* ==========================
       LOGOUT
    ========================== */

    static logout(req, res) {

        req.session.destroy(() => {

            res.redirect("/login");

        });

    }

    /* ==========================
       API JSON
    ========================== */

    static async apiUsuarios(req, res) {

        const usuarios =

            await Usuario.findAll({

                attributes: [

                    "IdUser",

                    "Login",

                    "StatusADM"

                ]

            });

        res.json(usuarios);

    }

}

module.exports = AuthController;
