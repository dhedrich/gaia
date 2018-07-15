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

  $("#submit").on('click', function(event){
    event.preventDefault()
    var formData = {
      email : $("#email").val().trim(),
      tempHigh : $("#tempHigh").val().trim(),
      tempLow : $("#tempLow").val().trim(),
      rhHigh : $("#rhHigh").val().trim(),
      rhLow : $("#rhLow").val().trim()
    }
    $.ajax({
      method: 'POST',
      url: '/user',
      data: formData
      // dataType: "json",
      // success: function(data) {
      //   alert(data)
      // },
      // failure: function(err) {
      //   alert(err)
      // }
    })
    .done(function (data) {
      console.log('SUCCESS =================', data)
    })
    .fail(function (err) {
      console.log('ERROR ===================', err)
    })
    $("#email").val('')
    $("#tempHigh").val('')
    $("#tempLow").val('')
    $("#rhHigh").val('')
    $("#rhLow").val('')
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
      <td>${temp} °C</td>
      <td>${rh} %</td>
    </tr>`)
  }

  // update current temp/rh
  $('#currTemp').text(`${res[res.length -1].temp} °C`)
  $('#currRH').text(`${res[res.length -1].rh} %`)
}