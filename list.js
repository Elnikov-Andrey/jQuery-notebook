$(function(){
  var tasksList = {}
  
  var $id = $('#id');
  var $newTask = $('#newTask');
  var $letsGoBtn = $('#letsGo');
  var $addTaskBtn = $('#addTaskBtn');
  var $formList = $('tbody');
  var $form = $('form');
  var $selectTodo = $('#selectTodo');

  var $editBtn = $('.edit-btn');
  var $deleteBtn = $('.delete-btn');
  var $formInput = $('.form-input')

  var todoListTemplate = $('#todoListTemplate').html();

  $letsGoBtn.click(showForm)
  $addTaskBtn.click(onFormSubmit);
  init();

  $formList
    .on('click', '.edit-btn', onEditBtnClick)
    .on('click', '.delete-btn', onDeleteBtnClick)

  $form
    .hide()
    .change(onFormChange)

  function showForm(){
    $form.show('slow');
  }

  function onFormChange(){
    checkFormValid();
  }

  function onFormSubmit(event){
    event.preventDefault();
    
    var task = {
      id: $id.val(),
      newTask: $newTask.val()
    }
  
    setTask(task);
    clearForm();
    hideform();
  }

  function hideform(){
    $form.hide('slow');
  };

  function addTaskToList(task){
    var addLine = todoListTemplate
      .replace('{{id}}', task.id)
      .replace('{{newTask}}', task.newTask)
    $formList.append(addLine);
  }

  function clearForm(){
    $id.val('');
    $newTask.val('');
  }

  function createTaskElement(task){
    var row = todoListTemplate
      .replace('{{id}}', task.id)
      .replace('{{newTask}}', task.newTask)
    return $(row);
  }

//----------------------------------
  //редактирование записи
  function onEditBtnClick(){
    var id = $(this).closest('tr').data('id');
    editTask(id);

  }

  function editTask(id){
    var task = tasksList[id];
    $form.show('slow');
    fillForm(task);
  }

  function fillForm(task){
    $id.val(task.id);
    $newTask.val(task.newTask);

    checkFormValid();
  }


  //-----------------------------------
  //удаление записи
  function onDeleteBtnClick(){
    var id = $(this).closest('tr').data('id');
    deleteTask(id);
  }

  function deleteTask(id){
    delete id;
    removeTask(id);
    saveTasks();
  }

  function removeTask(id) {
      var $span = getTaskElemet(id);
      $span.fadeOut('slow', function(){
      $span.remove();
    });
  }

  function getTaskElemet(id){
    return $('[data-id="' + id + '"]');
  }

//-----------------------------------------------
  function init(){
    var item = localStorage.getItem('list');

    if (item){
      tasksList = JSON.parse(item);
    }

    $.each(tasksList, function(i, task) {
      renderNewTask(task)
    });
  }

  function renderNewTask(task){
    var $row = createTaskElement(task);
    $formList.append($row);
    $row.fadeIn(300);
    //checkTodo($row);
  }

// function checkTodo($row){
//     if ($selectTodo.val() == 'todo'){
//       //console.log('todo')
//       $row.css('color', 'red')
//     } else {
//       //console.log('done')
//       $row.css('color', 'green')
//     }
//   }


  function saveTasks(){
    localStorage.setItem('list', JSON.stringify(tasksList));
  }

  function setTask(task){
    task.id ? updateTask(task) : addTask(task);
    saveTasks();
  }

  function updateTask(task){
    tasksList[task.id] = task; 

    renderUpdatedTask(task);
  }

  function renderUpdatedTask(task){
    var $tr = getTaskElemet(task.id);
    var $row = createTaskElement(task);
    $tr.replaceWith($row);
  }

  function addTask(task){
    task.id = Date.now();
    tasksList[task.id] = task;

    renderNewTask(task);
  }

  function checkFormValid(){
    if(isFormValid()){
      enableButton()
    } else {
      disableButton()
    }
  }

  function isFormValid(){
    var result = false;

    if ($newTask.val() !== false){
        result = true;
        return result
    }
    
  }

  function enableButton(){
    $addTaskBtn.removeAttr('disabled')
  }

  function disableButton(){
    $addTaskBtn.attr('disabled', 'disabled')
  }

})