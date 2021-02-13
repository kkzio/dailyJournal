require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const moongose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// db connect
moongose.connect(
    `mongodb+srv://admin-aji:${process.env.PASSWORD_MONGO}@cluster0.tyks3.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`, 
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true
    }
);
const db = moongose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('db connected!');
});

const homeStartingContent = "This homepage will show you daily journal, if you want write follow this link http://localhost:3000/compose then you will able to write something daily journal. Thank you for come here, hope you enjoy this website";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

// data compose
const postsSchema = new moongose.Schema({
    title: String,
    content: String
});

const Post = moongose.model("Post", postsSchema);

let posts = [];

app.get("/", (req, res) => {
    Post.find({},  (err, posts) => {
        if(err){
            console.log(err);
        } else if(posts) {
            res.render('home', { startingContent: homeStartingContent, post: posts });
        }
    });
});

app.get("/about", (req, res) => {
    res.render("about", { startingContent: aboutContent });
});

app.get("/contact", (req, res) => {
    res.render("contact", { startingContent: contactContent });
});

// compose
app.get("/compose", (req, res) => {
    res.render("compose");
});

app.post("/compose", (req, res) => {
    const post = new Post({
        title: req.body.postTitle,
        content: req.body.postBody
    });

    post.save( (err) => {
        if(!err){
            res.redirect("/");
        } else if (err) {
            console.log(err);
        }
    });
})


// routing
app.get("/posts/:postId", (req, res) => {
    const requestedPostId = req.params.postId;

  Post.findById(requestedPostId, (err, post) => {
      if (err) {
          console.log(err);
      } else if(post) {
        res.render("post", {
        title: post.title,
        content: post.content
        });
      }
  });
})

app.listen(3000, () => {
    console.log("servernya jalam di localhost:3000");
})