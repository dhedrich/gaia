$(document).ready(
    $.ajax({
        method: 'GET',
        url: '/history',
      })
      .done(function (res) {
        console.log('SUCCESS =================', res)
      })
      .fail(function (err) {
        console.log('ERROR ======================', err)
      })
)