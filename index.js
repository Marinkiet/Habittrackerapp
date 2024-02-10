const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");


//initialize app
const app = express();
const port = 3000;
const cors = require("cors");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect("mongodb+srv://marinkie:gomongo@cluster0.hpjmhdc.mongodb.net/")
    .then(() => {
        console.log("Connected to mongodb")
    }).catch((error) => {
        console.log("Error connecting to mongodb " + error);
    })

app.listen(port, () => {
    console.log("Server running on port " + port);
})

//call modal for the habit
const Habit = require('./models/habit')


//Endpoint to create a habit in the backend
app.post("/habits", async (req, res) => {
    try {
        //need access to these to create a habit
        const { title, color, repeatMode, reminder } = req.body;

        //Create the new Habit 
        const newHabit = new Habit({
            title,
            color,
            repeatMode,
            reminder,
            // completed
        })
        // save to backend
        const savedHabit = await newHabit.save();
        res.status(200).json(savedHabit)

    } catch (error) {
        res.status(500).json({ error: "Network error, could not create habit" });
    }
})

//Endpoint to get a habit from the backend
app.get("/habitslist", async (req, res) => {

    try {
        const allHabits = await Habit.find({});
        res.status(200).json(allHabits)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

//Endpoint to update/mark a acomplete habit for the day

app.put("/habits/:habitId/completed", async (req, res) => {
    const habitId = req.params.habitId;
    const updatedCompletion = req.body.completed; // The updated completion object

    try {
        const updatedHabit = await Habit.findByIdAndUpdate(
            habitId,
            { completed: updatedCompletion },
            { new: true }
        );

        if (!updatedHabit) {
            return res.status(404).json({ error: "Habit not found" });
        }

        return res.status(200).json(updatedHabit);
    } catch (error) {
        return res.status(500).json({ error: "Habit could not be uppdated to complete" + error.message });
    }
});


app.delete("/habits/:habitId/", async (req, res) => {
    try {
        const habitId = req.params.habitId;
        await Habit.findByIdAndDelete(habitId);

        res.status(200).json({ message: "Habit deleted Successfully" });
    } catch (error) {
        return res.status(500).json({ error: "Could not delete habit" + error.message })
    }
})
