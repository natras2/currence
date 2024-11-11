const User = require('../../model/User');

async function userAuthenticate(questioningUser) {
    const firebaseUid = questioningUser.uid;
    const user = await User.findOne({ 
        where: { firebaseUid: firebaseUid } 
    });

    if (!user) {
        user = await User.create({
            firebaseUid: questioningUser.uid,
            fullName: questioningUser.name,
            email: questioningUser.email
        });
    }

    return ;
}

module.exports = {
    userAuthenticate
};