/* globals moment: true */
(function(){

  'use strict';

  $(document).ready(initialize);

  function initialize(){
    $(document).foundation();

    //priorities--------
    getPriorities();
    $('#pSave').click(savePriority);
    $('#pTable').on('click', '.pDelete', deleteRow);
    $('#pTable').on('click', '.popToInput', changeToInput);
    $('#pConfirm').click(confirmChanges);
    $('#openpForm').click(openForm);
    $('#addTask').click(saveTask);

    //tasks----------
    getTasks();


  }
//------------------GLOBALS-------------------------//

  var $removedRow; // used to track row that delete button was clicked on, for deletion after succes from database res
  var $editRow;


//-------------------------------------------------------//
//----------------------PRIORITIES-----------------------//
//-------------------------------------------------------//

  function getPriorities(){
  //populates table with every document in database
  //defalault is for priorities to be sorted by value
    var url = window.location.origin.replace(/3000/, '4000') + '/priorities';
    $.getJSON(url, getSuccess);
  }

  function getSuccess(data){
  //Called on success of initial page load getJSON request
    for(var i = 0; i < data.priorities.length; i ++){
      addPriorityToTable(data.priorities[i]);
    }
  }

  function openForm(){
  //Displays 'add priority form' when 'add' button clicked
    $('#pForm').show();
    $('body').addClass('disableBG');
  }

  function savePriority(){
  // function gets text in priority input form, adds to database, and to table

  //get input
    var name = $('#pNameInput').val();
    var value = $('#pValueInput').val();
    $('#pNameInput').val('').focus();
    $('#pValueInput').val('');
    $('body').removeClass('disableBG');

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

      //for Task input box
      var $option = $('<option>').val(data._id).text(data.name);
      $('#selectPriority').append($option);

      $tdDelete.append($img);
      $tdName.append($divName);
      $tdValue.append($divValue);
      $row.append($tdName, $tdValue, $tdDelete);
      $('#tBody').append($row);
    }else{
      alert('priority name already exists in database, please pick a different name and try again');
    }
    $('#pForm').hide();

  }

  function deleteRow(){
  //remove row from priorities table and its contents from the database

    $removedRow = $(this).parent().parent();
    //sets global variable to be used if delete request is successful

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
    $('#pConfirm').show();
    $editRow = $(this).parent().parent();
    $editRow.addClass('editRow');
    var prevText = $(this).text();
    $(this).replaceWith('<input type="text" value="'+prevText+'">');
  }

  function confirmChanges(){
    //function is called when confirm button is clicked
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
    debugger;
    
    var url = window.location.origin.replace(/3000/, '4000') + '/priorities/';
    var obj = {name: name, value: value, _id: id};
    var type = 'PUT';
    var success = updateTable;
    $.ajax({url: url, type: type, data:obj, success: success});
  }

  function updateTable(data){
    console.log(data);
    $('#tBody tr').remove();
    getPriorities();
    $('#pConfirm').hide();
  }

//-------------------------------------------------------//
//----------------------TASKS----------------------------//
//-------------------------------------------------------//


  function getTasks(){
    //Gets all tasks from database
    var url = window.location.origin.replace(/3000/, '4000') + '/tasks/filter';
    $.getJSON(url, initGetSuccess);
  }

  function initGetSuccess(data){
    for(var i = 0; i < data.tasks.length; i++){
      addTaskToTable(data.tasks[i]);
    }
  }

  function addTaskToTable(task){
    //Get data
    debugger;
    var isComplete = task.isComplete;
    var name = task.name;
    var dueDate = moment(task.dueDate).format('ll');
    var taskId = task._id;

    //make an a tag for each tag
    var tags = task.tags;
    var $tags = $('<div>');
    for(var j = 0; j < tags.length; j++){
      var $tag = $('<a href="#">');
      if(j+1 === tags.length){
        //last tag appended wont have comma after it
        $tag.text(tags[j]);
        $tags.append($tag);
      }else{
        $tag.text(tags[j]+', ');
        $tags.append($tag);
      }
    }

    // find priorityName associated with priority ID
    var priorityId = task.priority;
    var priorityName = $('tr[data-id="'+priorityId+'"]').children(':first').children(':first').text();

    //Create jQuery DOM elements

    var $isComplete = $('<td>');
    if(isComplete === true){
      $isComplete.append($('<input type="checkbox" checked>'));
    }else{
      $isComplete.append($('<input type="checkbox">'));
    }

    var $name = $('<td>').append($('<div>').text(name));
    var $priority = $('<td>').append($('<div>').text(priorityName));
    var $dueDate = $('<td>').append($('<div>').text(dueDate));
    var $tagData = $('<td>').append($tags);
    var $img = $('<img src="../../media/delete.png"/>').addClass('tDelete'); //will be used to delete row

    var $row = $('<tr>').append($isComplete, $name, $dueDate, $priority, $tagData, $img);
    $row.attr('data-id', taskId);
    $('#taskTBody').append($row);

    clearTaskInputs();
  }

  function saveTask(event){
    var name = $('#taskNameInput').val();
    var dueDate = $('#taskDueDateInput').val();
    var priorityId = $('#selectPriority').val();
    var tags = $('#tagsInput').val().split (' ,') || 'other';
    var isComplete = $('#isCompleteInput').prop('checked');
    event.preventDefault();  // prevents form from submitting twice
    console.log(name, dueDate, priorityId, tags, isComplete);
    
    var url = window.location.origin.replace(/3000/, '4000') + '/tasks';
    var obj = {name:name, dueDate:dueDate, priority: priorityId, tags:tags, isComplete:isComplete};
    var type = 'POST';
    var success = addTaskToTable;

    $.ajax({url: url, type: type, data:obj, success: success});
  }

  function clearTaskInputs(){
    $('#taskNameInput').val('');
    $('#taskDueDateInput').val('');
    $('#selectPriority').val('');
    $('#tagsInput').val('');
  }

})();

