var peopleArray = [];
var patronusArray = [];
var peopleAndPatroniArray = [];
var oldInfo;

$(document).ready(function(){
  $('.oldDB').empty();
  pullOld();
  $('.employee-submit').on('click', personSubmit);

});


function personSubmit(event){
  event.preventDefault();
  var person={};
  $.each($("#employee-form").serializeArray(), function(i, field){
      person[field.name] = field.value;
    });
    console.log(person);
  $.ajax({
    type:"POST",
    url:"/duck",
    data: person,
    success: function(data){
      console.log(data);
    }
  });
}

function pullOld(){
  $.ajax({
    type:"GET",
    url:"/oldPeople",
    success: function(data){
      oldInfo=data;
      postingOld(oldInfo);

    }
  });
}

function postingOld(data){
  $('.oldDB').append("<div class='independant'></div>");
  for (var i=0; i<data.length;i++){
    $('.independant').append("<p>"+data[i].first_name+"  "+data[i].last_name+"  "+data[i].employee_id+"  "+data[i].job_title+"  "+data[i].salary+"<button class='buttony'>delete</button></p>");
    $('.independant').append("<br />");
  }
}

function inactivity(){
  $.ajax({
    type:"POST",
    url:"/people",
    data: person,
    success: function(data){
      console.log(data);
    }
  });
}
