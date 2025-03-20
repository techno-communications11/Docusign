import bcrypt from 'bcrypt'
import db from '../dbConnection/db.js'

const resetpassword = async (req, res) => {
    //taking incomming request from client as req.body
    const { email, newPassword } = req.body; //here destructuring the object

    console.log('Incoming request body:', req.body);

    if (!email || !newPassword) {//checking the incomming values
        // console.log('Missing email or newPassword');
        return res.status(400).send('Email and newPassword are required.'); //returung the response
    }

    try {
        // Hash the password
        const hashedPassword = bcrypt.hashSync(newPassword, 8);
        // console.log('Hashed password:', hashedPassword);

        // Query to update the password
        const query = 'UPDATE users SET password = ? WHERE email = ?';
        // console.log('Executing query:', query);
        // console.log('Query parameters:', [hashedPassword, email]);

        // Execute the query
        const [result] = await db.execute(query, [hashedPassword, email]);

        // console.log('Password reset result:', result);

        if (result.affectedRows === 0) {
            // console.log('User not found for email:', email);
            return res.status(404).send('User not found.');
        }

        // console.log('Password reset successfully for email:', email);
        res.send('newPassword reset successfully.');
    } catch (err) {
        console.error('Error updating newPassword:', err);
        res.status(500).send('Internal server error.');
        //internl server error
    }
};

export default resetpassword;