const User = require("../models/User");
const Tag = require("../models/Tag");

const searchResult = async (req,res) => {
    const {search} = req.query
    try {
        const users = await User.find({ username: { $regex: '.*' + search + '.*' } }, "_id username avatar")

        let tags = await Tag.aggregate( [
            {
                $lookup: {
                    from: "posts",
                    localField: "tag",
                    foreignField: "tags",
                    as: "tag_matches"
                }
            },
            { $project: {  tag: 1, _id: 0, count: { $size: "$tag_matches" } } }
        ] )
        const filtered = tags.filter(entry => Object.values(entry).some(val => typeof val === "string" && val.includes(search)));

        const result = users.concat(filtered)
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json(err);
    }
}

const addHistory = async (req,res) => {
    const { id } = req.params;
    const {history} = req.body
    try {
        const user = await User.findById(id)
        user.searchHistory.push(history)
        let result = user.searchHistory.reverse().filter(
            (t, index) => index === user.searchHistory.findIndex(
                o => t.userId === o.userId
                    && t.tag === o.tag
            ));
        const updatedUser = await User.findByIdAndUpdate(id, {searchHistory: result}, {new: true})
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json(err);
    }
}

const searchHistory = async (req,res) => {
    const { id } = req.params;
    try {
        const history = await User.findById(id).select('searchHistory -_id').lean()

        const users = history.searchHistory.filter(u => !!u.userId)
        let userId = users.map(a => a.userId)
        const usersInfo = await User.find({ '_id': { $in: userId } }, "_id username avatar").lean()
        /*const searchUser = usersInfo.map(({_id: userId, username, avatar})=>({userId, username, avatar}))*/

        let tagsCount = await Tag.aggregate( [
            {
                $lookup: {
                    from: "posts",
                    localField: "tag",
                    foreignField: "tags",
                    as: "tag_matches"
                }
            },
            { $project: {  tag: 1, _id: 0, count: { $size: "$tag_matches" } } }
        ] )

        const result1 = history.searchHistory.map(h => ({...h, ...usersInfo.find(u => u._id.toString() === h.userId)}))
        const result2 = result1.map(r => ({...r, ...tagsCount.find(t => t.tag.toString() === r.tag)}))
        res.status(200).json(result2)
    } catch (err) {
        res.status(500).json(err);
    }
}

const deleteHistory = async (req,res) => {
    const { id } = req.params;
    const { history } = req.body;
    try {
        const user = await User.findById(id)
        const deleteHistory = user.searchHistory.filter((h) => (h.userId !== history && h.tag !== history))
        await User.findByIdAndUpdate(id, {searchHistory: deleteHistory}, { new: true })
        res.status(200).json(history)
    } catch (err) {
        res.status(500).json(err);
    }
}


module.exports = {
    searchResult,
    addHistory,
    searchHistory,
    deleteHistory
}