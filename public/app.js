$(document).ready(
  // grab all temp/rh data in db, render to homepage
  $.ajax({
      method: 'GET',
      url: '/history',
    })
    .done(function (res) {
      console.log('SUCCESS =================', res)
      renderTable(res)
    })
    .fail(function (err) {
      console.log('ERROR ===================', err)
    })
  )

function renderTable(res) {
  // empty recents table
  $('#recentsTable').empty().append(`<tr>
      <th>Timestamp</th>
      <th>Temperature</th>
      <th>Humidity</th>
    </tr>`)

  // set max length of table to 10 entries
  var limit = 0
  if (res.length > 10) {
    limit = res.length - 10
  }
  
  // post data to table
  for (var i = res.length - 1; i >= limit; i--) {
    var timestamp = res[i].timestamp
    var temp = res[i].temp
    var rh = res[i].rh
    $('#recentsTable').append(`<tr>
      <td>${timestamp}</td>
      <td>${temp}</td>
      <td>${rh}</td>
    </tr>`)
  }
}