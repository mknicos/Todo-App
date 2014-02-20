(function(){

  'use strict';

  $(document).ready(initialize);

  function initialize(){
    $(document).foundation();
    getPriorities();
    $('#pSave').click(savePriority);
    $('#pTable').on('click', '.pDelete', deleteRow);
    $('#pTable').on('click', '.popToInput', changeToInput);
    $('#confirm').click(confirmChanges);
    $('#openpForm').click(openForm);
  }

  var $removedRow; // used to track row that delete button was clicked on, for deletion after succes from database res
  var $editRow;

  function getPriorities(){
  //populates table with initial database entries
    var url = window.location.origin.replace(/3000/, '4000') + '/priorities';
    $.getJSON(url, getSuccess);
  }

  function getSuccess(data){
  //Called on success of initial page load getJSON requests
    for(var i = 0; i < data.priorities.length; i ++){
      addPriorityToTable(data.priorities[i]);
    }
  }

  function openForm(){
    $('#pForm').show();
  }

  function savePriority(){
  // function gets text in priority input form, adds to database, and to table

  //get input
    var name = $('#pNameInput').val();
    var value = $('#pValueInput').val();
    $('#pNameInput').val('').focus();
    $('#pValueInput').val('');

  // Ajax post to db
    var url = window.location.origin.replace(/3000/, '4000') + '/priorities';
    var obj = {name:name, value: value};
    var type = 'POST';
    var success = addPriorityToTable;

    $.ajax({url: url, type: type, data:obj, success: success});

    event.preventDefault();  // prevents form from submitting twice
  }

  function addPriorityToTable(data){
    //data is an object returned from the server after a POST request -- OR -- on page load from getPriorities fn
    //it will have an id if it was not a duplicate and successfully added
    //otherwise it will not have an id, but just be the value and name
    if(data._id){
      var $divName = $('<div>').text(data.name).addClass('popToInput columnName');
      var $divValue = $('<div>').text(data.value).addClass('popToInput columnValue');
      var $img = $('<img src="../../media/delete.png"/>').addClass('pDelete'); //will be used to delete row
      var $row = $('<tr>').attr('data-id', data._id);
      var $tdName = $('<td>');
      var $tdValue = $('<td>');
      var $tdDelete = $('<td>');

      $tdDelete.append($img);
      $tdName.append($divName);
      $tdValue.append($divValue);
      $row.append($tdName, $tdValue, $tdDelete);
      $('#pTable').append($row);
    }else{
      alert('priority name already exists in database, please pick a different name and try again');
    }
    $('#pForm').hide();

  }

  function deleteRow(){
    $removedRow = $(this).parent().parent();
    //sets global variable to be used if delete request is successful

  //remove row from priorities table and its contents from the database
    var id = $(this).parent().parent().data().id;
    var url = window.location.origin.replace(/3000/, '4000') + '/priorities/' + id;
    var type = 'DELETE';
    var success = removeFromPriorTable;

    $.ajax({url:url, type:type, success: success});
  }

  function removeFromPriorTable(data){
    if(data.count === 1){
      $removedRow.remove();
    }else{
      alert('Delete Failed');
    }
  }

  function changeToInput(){
    // function is called when any name or number is clicked in priority table
    // element that is clicked on is turned into a input box
    $('#confirm').show();
    $editRow = $(this).parent().parent();
    $editRow.addClass('editRow');
    var prevText = $(this).text();
    $(this).replaceWith('<input type="text" value="'+prevText+'">');
  }

  function confirmChanges(){
    //funciton is called when confirm button is clicked
    //sends updated input boxes to database
    //because user input could be on both or one table element
    //this accounts for either an unchanged or a changed element
    //by the user
    var nameText, nameVal, id, valueVal, valueText, name, value;
    nameVal = $editRow.children(':first').children().val();
    nameText = $editRow.children(':first').children().text();
    valueVal = $editRow.children(':nth-child(2)').children().val();
    valueText = $editRow.children(':nth-child(2)').children().text();

    if(nameVal){
      name = nameVal;
    }else{
      name = nameText;
    }
    if(valueVal){
      value = valueVal;
    }else{
      value = valueText;
    }
    id = $editRow.data('id');
    
    var url = window.location.origin.replace(/3000/, '4000') + '/priorities/';
    var obj = {name: name, value: value, _id: id};
    var type = 'PUT';
    var success = updateTable;
    $.ajax({url: url, type: type, data:obj, success: success});
  }

  function updateTable(data){
    console.log(data);
    $('#pTable tr').remove();
    getPriorities();
    $('#confirm').hide();
    //var id = data._id;
    //var name = data.name;
    //var value = data.value;
   // var row = $('tr[data-id='+id+']');
    //row.children(':first').children().replaceWith('<div text="'+name+'">');
    //row.children(':nth-child(2)').children().replaceWith('<div>').text(value);
  }

})();

