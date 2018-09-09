window.addEventListener('load', function() {
  var form = document.getElementById('submit_form');
  function submitStory() {
    var arthur = document.getElementById("arthur").value;
    var email = document.getElementById("email").value;
    var title = document.getElementById("title").value;
    var story = document.getElementById("story").value;
    // console.log('submit: ', username, email, story);
    fetch('/sendemail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        'arthur': arthur,
        'email': email,
        'title': title,
        'story': story
      })
    }).then(function(data) {
      window.alert("Thank you for your submission!");
      console.log(data);
      document.getElementById("story").value = '';
      document.getElementById("title").value = '';
    }).catch(function(err) {
      console.log(err.stack);
    });
  };
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    submitStory();
  });
});
