require.config({
  baseUrl: "/js/libs",
  paths: {
    "@sendgrid/mail'": "@sendgrid/mail/index"
  }
});

window.addEventListener('load', function() {
  return require(["@sendgrid/mail'"], function(sgMail) {
    var form, submitStory;
    console.log(sgMail);
    form = document.getElementById('submit_form');
    submitStory = function() {
      var email, story, username;
      username = document.getElementById("user_name").value;
      email = document.getElementById("user_email").value;
      story = document.getElementById("user_story").value;
      console.log('submit', username, email, story);
    };
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      submitStory();
    });
  });
});
