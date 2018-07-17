$(document).ready(function() {
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
      tempHigh : parseInt($("#tempHigh").val().trim()),
      tempLow : parseInt($("#tempLow").val().trim()),
      rhHigh : parseInt($("#rhHigh").val().trim()),
      rhLow : parseInt($("#rhLow").val().trim())
    }
    $.ajax({
      method: 'POST',
      url: '/user',
      data: formData
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

  function renderTable(res) {
    // empty recents table
    $('#recentsTable').empty().append(`<thead>
          <tr class="table-primary">
            <th id="table-left" scope="col"></th>  
            <th scope="col">Timestamp</th>
            <th scope="col">Temperature</th>
            <th id="table-right" scope="col">Humidity</th>
          </tr>
        </thead>`)

    // set max length of table to 10 entries
    var limit = 0
    if (res.length > 10) {
      limit = res.length - 10
    }
    
    // post data to table
    var count = 1 
    for (var i = res.length - 1; i >= limit; i--) {
      var timestamp = res[i].timestamp
      var temp = res[i].temp
      var rh = res[i].rh
      $('#recentsTable').append(`<tr>
        <th scope="row">${count}</th>
        <td>${timestamp}</td>
        <td>${temp} °C</td>
        <td>${rh} %</td>
      </tr>`)
      count++
    }

    // update current temp/rh
    $('#currTemp').text(`${res[res.length -1].temp} °C`)
    $('#currRH').text(`${res[res.length -1].rh} %`)
  }
})