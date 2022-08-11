"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const prismaClient_1 = __importDefault(require("./prismaClient"));
dotenv_1.default.config();
// initialize the express app
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// route for deleting all the characters
// app.delete('/characters', async (req, res) => {
//     try {
//         await prisma.character.deleteMany({});
//         res.status(200).json({
//             message: "Successfully deleted all characters"
//         });
//     } catch (error) {
//         res.status(400).json({
//             message: "Error deleting all characters",
//             error: error.toString()
//         });
//     }
// });
// script for adding the data
// app.get("/data", async (req, res) => {
//     try {
//         let added = 0;
//         for (let i = 0; i < 8; i++) {
//             const data = await axios.get(`https://gateway.marvel.com/v1/public/characters?ts=${process.env.TS}&apikey=${process.env.PUBLIC_KEY}&hash=${process.env.HASH}&limit=100&offset=${i * 100}`);
//             for (let char of data.data.data.results) {
//                 let image = char.thumbnail.path + "." + char.thumbnail.extension;
//                 if (!image.includes("image_not_available")) {
//                     console.log("ADDED ", char.name, ++added);
//                     await prisma.character.create({
//                         data: {
//                             name: char.name,
//                             image: image
//                         },
//                     });
//                 }
//             }
//         }
//         res.status(200).json({ data: "added" });
//     }
//     catch (error) {
//         console.log(error);
//         res.send("error");
//     }
// });
// api route for getting characters by id
app.get("/character/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const character = yield prismaClient_1.default.character.findFirst({
            where: {
                id: id,
            },
            select: {
                id: true,
                name: true,
                image: true,
            },
        });
        res.status(200).json({
            message: "Successfully found character",
            data: character,
        });
    }
    catch (error) {
        res.status(400).json({
            message: "Error finding character",
            error: error.toString(),
        });
    }
}));
// adding a new Character
// app.post("/addCharacter", async (req, res) => {
//     const { id, name, image } = req.body;
//     try {
//         const newCharacter = await prisma.character.create({
//             data: {
//                 id,
//                 name,
//                 image,
//             },
//         });
//         return res.status(201).json({ newCharacter });
//     } catch (error) {
//         console.log(error);
//         return res.status(400).json({ error: error.toString() });
//     }
// })
// adding a new vote
app.post("/vote", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { votedForId, votedAgainstId } = req.body;
    try {
        const newVote = yield prismaClient_1.default.vote.create({
            data: {
                votedForId,
                votedAgainstId,
            },
        });
        return res.status(201).json({ newVote });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({ error: error.toString() });
    }
}));
app.get("/results", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let data = yield prismaClient_1.default.character.findMany({
            orderBy: {
                VoteFor: { _count: "desc" },
            },
            select: {
                id: true,
                name: true,
                image: true,
                _count: {
                    select: {
                        VoteFor: true,
                        VoteAgainst: true,
                    },
                },
            },
        });
        console.log(data);
        return res.status(200).json({ data });
    }
    catch (error) {
        console.log(error);
        res.json({ error: error.toString() });
    }
}));
app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
}).on('error', (err) => {
    console.log(err);
});
//# sourceMappingURL=index.js.map