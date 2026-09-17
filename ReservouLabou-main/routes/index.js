const express = require("express");
const router = express.Router();

router.use(
    "/auth",
    require("./auth.routes")
);

router.use(
    "/laboratorios",
    require("./laboratorio.routes")
);

router.use(
    "/equipamentos",
    require("./equipamento.routes")
);

router.use(
    "/reservas/laboratorios",
    require("./reservaLaboratorio.routes")
);

router.use(
    "/reservas/equipamentos",
    require("./reservaEquipamento.routes")
);

router.use(
    "/historico",
    require("./historico.routes")
);

router.get("/", (req, res) => {

    res.redirect("/historico/dashboard");

});

module.exports = router;
