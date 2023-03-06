const User = require('../models/User');
const Notification = require('../models/Notification')
const bcrypt = require('bcrypt');

const handleRegister = async (req, res) => {
    const { email, user, pwd } = req.body;
    if (!email || !user || !pwd) return res.status(400).json({ 'message': 'Email, username and password are required.' });

    // check for duplicate usernames in the db
    const duplicateEmail = await User.findOne({ email: email }).exec();
    const duplicateName = await User.findOne({ username: user }).exec();
    if (duplicateEmail || duplicateName) return res.sendStatus(409); //Conflict

    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);

        //create and store the new user
        const result = await User.create({
            "email": email,
            "username": user,
            "password": hashedPwd
        });

        const notification = await new Notification({userId: result._id}).save()

        console.log(result, notification);

        res.status(201).json({ 'success': `New user ${user} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = {
   handleRegister,
};