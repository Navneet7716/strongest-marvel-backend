import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import prisma from "./prismaClient"

dotenv.config();

// initialize the express app
const app = express();
app.use(cors());
app.use(express.json());

// route for deleting all the characters
app.delete('/characters', async (req, res) => {
    try {
        await prisma.character.deleteMany({});
        res.status(200).json({
            message: "Successfully deleted all characters"
        });
    } catch (error) {
        res.status(400).json({
            message: "Error deleting all characters",
            error: error.toString()
        });
    }
});

// script for adding the data
app.get("/data", async (req, res) => {

    try {

        for (let i = 0; i < 8; i++) {
            const data = await axios.get(`https://gateway.marvel.com/v1/public/characters?ts=${process.env.TS}&apikey=${process.env.PUBLIC_KEY}&hash=${process.env.HASH}&limit=100&offset=${i * 100}`);
            for (let char of data.data.data.results) {
                console.log("ADDED CHARACTER ", char.name);
                let image = char.thumbnail.path + "." + char.thumbnail.extension;
                await prisma.character.create({
                    data: {
                        id: char.id,
                        name: char.name,
                        image: image
                    },
                });
            }
        }

        res.status(200).json({ data: "added" });
    }
    catch (error) {
        console.log(error);
        res.send("error");
    }

});


// api route for getting characters by id
app.get("/character/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const character = await prisma.character.findFirst({
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
    } catch (error) {
        res.status(400).json({
            message: "Error finding character",
            error: error.toString(),
        });
    }
});


// adding a new Character
app.post("/addCharacter", async (req, res) => {
    const { id, name, image } = req.body;
  
    try {
        const newCharacter = await prisma.character.create({
            data: {
                id,
                name,
                image,
            },
        });

        return res.status(201).json({ newCharacter });

    } catch (error) {
        console.log(error);

        return res.status(400).json({ error: error.toString() });
    }



})


// adding a new vote
app.post("/vote", async (req, res) => {
    const { votedForId, votedAgainstId } = req.body;
    try {
        const newVote = await prisma.vote.create({
            data: {
                votedForId,
                votedAgainstId,
            },
        });

        return res.status(201).json({ newVote });

    } catch (error) {
        console.log(error);

        return res.status(400).json({ error: error.toString() });
    }
})


app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
}).on('error', (err) => {
    console.log(err);
});
