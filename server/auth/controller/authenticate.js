const User = require('../../model/User');

async function userAuthenticate(questioningUser) {
    console.log(questioningUser);
    const firebaseUid = questioningUser.uid;
    const user = await User.findOne({ 
        where: { firebaseUid: firebaseUid } 
    });
    try {
        if (!user) {
            await User.create({
                firebaseUid: questioningUser.uid,
                fullName: questioningUser.name,
                email: questioningUser.email
            });
        }
    }
    catch(error) {
        console.error("An error occurred", error);
        throw("An error occurred while inserting the new user in DB");
    }

    return ;
}

module.exports = {
    userAuthenticate
};