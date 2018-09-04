require.config({
  baseUrl: "/js/libs",
  paths: {
      "@sendgrid/mail'": "@sendgrid/mail/index"
  },
});

window.addEventListener 'load', ->
  require ["@sendgrid/mail'"], (sgMail) ->
    console.log sgMail
    form = document.getElementById('submit_form')

    submitStory = ->
      username = document.getElementById("user_name").value
      email = document.getElementById("user_email").value
      story = document.getElementById("user_story").value
      console.log 'submit', username, email, story

      return

    form.addEventListener 'submit', (event) ->
      event.preventDefault()
      submitStory()
      return
    return
